var flickr = require('../lib/flickr');
var soundcloud = require('../lib/soundcloud');
var youtube = require('../lib/youtube');

var Post = require('../models/post');
var NUM_APIS = 3;

module.exports = function(app) {
  /* Renders the newsfeed landing page. */
  app.get('/', function(request, response) {
    response.render('index.html');
  });

  /* Calls each of the APIs in parallel, aggregates the results, and
   * sends them back to the client. */
  app.get('/search', function(request, response) {
    var results = [];
    var numAPIsProcessed = 0;

    youtube.search(request.query.query, function(error, localResults) {
      if (error) {
        throw error;
      }

      var firstResult;
      if (localResults.length > 0) {
        firstResult = localResults[0];
        firstResult.api = 'youtube';
      }

      // always call aggregateResults(), so it knows when we're done
      aggregateResults(firstResult);
    });

    soundcloud.search(request.query.query, function(error, localResults) {
      if (error) {
        throw error;
      }

      var firstResult;
      if (localResults.length > 0) {
        firstResult = localResults[0];
        firstResult.api = 'soundcloud';
      }

      // always call aggregateResults(), so it knows when we're done
      aggregateResults(firstResult);
    });

    flickr.search(request.query.query, function(error, localResults) {
      if (error) {
        throw error;
      }
      
      var firstResult;
      if (localResults.length > 0) {
        firstResult = localResults[0];
        firstResult.api = 'flickr';
      }

      // always call aggregateResults(), so it knows when we're done
      aggregateResults(firstResult);
    });

    /* Adds the given firstResult to an array of results, sending that
     * array to the client once all APIs have returned. */
    function aggregateResults(firstResult) {
      numAPIsProcessed += 1;

      if (firstResult) {
        results.push(firstResult);
      }

      if (numAPIsProcessed === NUM_APIS) {
        response.json(200, results);
      }
    }
  });


  /* Creates a new post and saves it to MongoDB. */
  app.post('/posts', function(request, response) {
    if (!request.body.api || !request.body.title || !request.body.source) {
      response.send(422, 'Must provide an api, title, and source.');
      return;
    }

    var post = new Post({
      api: request.body.api,
      title: request.body.title,
      source: request.body.source,
      upvotes: 0
    });

    post.save(function(error, post) {
      if (error) {
        throw error;
      } else {
        response.json(200, post);
      }
    });
  });

  /* Loads all posts from MongoDB. */
  app.get('/posts', function(request, response) {
    Post.find(function(error, posts) {
      if (error) {
        throw error;
      } else {
        response.json(200, posts);
      }
    });
  });

  /* Deletes an existing post by removing it from MongoDB. */
  app.post('/posts/delete', function(request, response) {
    if (!request.body.id) {
      response.send(422, 'Must provide an id.');
      return;
    }

    Post.findByIdAndRemove(request.body.id, function(error, post) {
      if (error) {
        throw error;
      } else {
        response.send(200);
      }
    });
  });

  /* Upvotes an existing post by retrieving it, incrementing the vote count,
   * and saving it to MongoDB. */
  app.post('/posts/upvote', function(request, response) {
    if (!request.body.id) {
      response.send(422, 'Must provide an id.');
      return;
    }

    Post.findById(request.body.id, function(error, post) {
      if (error) {
        throw error;
      }

      post.upvotes += 1;
      post.save(function(error) {
        if (error) {
          throw error;
        }

        response.json(200, post);
      });
    });
  });
};
