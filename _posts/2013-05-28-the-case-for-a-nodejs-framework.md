---
layout: post
title: "The Case For A Node.js Framework"
---

## I love node.

Node.js is nice because it presents and enables choice. Node supplies little
more than what you need to start writing apps. Compared to most
languages and environments, the core of node is very small; you don't get much
more from it than asynchronous network and operating system IO, a clean module
system and a package manager. The rest of it comes from a thriving userland
ecosystem that's easy to install and manage on a per-application basis.

This presents a welcome change to the way we can write apps. The epitome of
[TIMTOWTDI](https://en.wikipedia.org/wiki/TIMTOWTDI), this allows one to
explicitly choose how to do every part of their application and not have to
worry about a large group of awkward standardized APIs getting in the way of
that.

## Everything is Terrible.

But it does come with some downsides. We run into a sort of "paradox of choice"
where we suddenly have to make conscious decisions on how to do basic stuff
like how to handle authentication and credentials, how to manage routes, and
which module to use for static file serving. Also, having all of these disparate
parts leads to a lot of what I call "API mapping" and "interface code." For
example, [glog](https://github.com/substack/glog) has an api that interfaces
with a request/response pair like this:

    if (glog.test(req.method)) {
      return glog(req, res);
    }

In and of itself this is not a terrible API. But, you may be using express to
manage middlewares and routes, and so you have to write a middleware adapter
for this module:

    var http = require('http'),
        express = require('express'),
        app = express();
    
    app.use(function (req, res, next) {
      if (glog.test(req.method)) {
        return glog(req, res);
      }
      next();
    });
    app.use(express.static(__dirname + '/public'));
    
    http.createServer(app).listen(8888);

In this example it's not too serious, but you can probably imagine what would
happen if you had to do this for every component you use to build your app.
This gets even worse when you choose a database to use (and db module and code
interfacing it with your model) and how to route requests (and code interfacing
that to your models and views). You start having to think about *how* you're
doing something, not *what* your doing. Sometimes that's better than the
alternative. Sometimes it's way more effort than it should be.

Moreover, the higher the complexity and scope of a module, the more dependencies
it takes on whether you're using them for a particular use case or not. For
example, this is the dependency tree I see when I run `npm install prompt`:

    prompt@0.2.9 node_modules/prompt
    ├── revalidator@0.1.5
    ├── pkginfo@0.3.0
    ├── read@1.0.4 (mute-stream@0.0.3)
    ├── utile@0.1.7 (deep-equal@0.0.0, rimraf@1.0.9, async@0.1.22, mkdirp@0.3.5, ncp@0.2.7, i@0.3.1)
    └── winston@0.6.2 (cycle@1.0.2, colors@0.6.0-1, eyes@0.1.8, stack-trace@0.0.6, pkginfo@0.2.3, async@0.1.22, request@2.9.203)

In this case, the two largest dependencies are `utile` and `winston`. `utile` is
only used for its merge method and the included async module. `winston` includes
`request`, the HTTP client module it uses as a base transport--even though in
this case it is only used to pretty print prompts to the screen. In cases of
limited scope such as a prompting utility, this can be mitigated by choosing
modules more judiciously. In this case, utile should be replaced by async (or
factored out by custom logic) and a merge module, and `winston` should be
replaced with `colors` and console.log.

For a full-stack framework, however, this is a serious problem. Basically, you
either end up with a gigantic framework that installs a bunch of stuff you might
not even use (a larger case of the `prompt` example),
[a stack of 30 separate libraries which all need to be required and interfaced manually](https://github.com/isaacs/npm-www/blob/master/package.json)
which may or may not even be called a framework, or
[the worst of both worlds](https://github.com/flatiron).

Because of these effects, while there are a lot of "node.js frameworks", they
tend to be pretty low level. At the lowest levels are not frameworks at all, but
[a bunch of modules written by the same person](https://github.com/substack),
and at the most sophisticated
[add some structure and "realtime" to express](http://derbyjs.com/).

In short: People complaining about node.js when they come over from other
platforms may not be right to dislike what they see, but they're not entirely
wrong either.

## Big Solves Your Problem

I've been a contributor and user of the [Big](https://github.com/bigcompany/big)
framework since last December. Big itself is about
[10 lines long](https://github.com/bigcompany/big/blob/master/big.js).
Using the [`resource`](https://github.com/bigcompany/resource) module, Big is
able to create a system where libraries written with it, called *resources*,
all have hookable, composable, reflectable and standardized APIs. With 
`resource`'s persistence features, developers are able to persist data to
arbitrary databases using jugglingdb and simple CRUD methods. With the
[`resources`](https://github.com/bigcompany/resources) module, Big is able to
offer a collection of curated components designed to work together from the
ground up, and because `resource` lazily installs resource dependencies it's
able to do so without installing a bunch of modules for things you don't use.

## Creating a Resource

You start by defining a resource with a name:

    var resource = require('resource');
    
    var creature = resource.define('creature');

Then, you can add methods to the resource:

    creature.method('talk', talk);
    function talk(msg) {
      console.log(msg);
      return msg;
    }

Then, you can call them like any other function:

    > creature.talk('hello!');
    hello!
    'hello!'
    > 

Resources created in this way can be exported and used just like any other
javascript library, and of course plays nice with them as well. Nothing
[crazy](http://docs.meteor.com/#structuringyourapp).

## Validating Arguments

You can also optionally set a
[JSON-schema](http://en.wikipedia.org/wiki/JSON#Schema) for the function's
arguments:

    creature.method('fire', fire, {
      description: 'fire a lazer in a certain direction',
      properties: {
        options: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              default: 'a creature'
            },
            direction: {
              type: 'string',
              enum: [ 'up', 'down', 'left', 'right' ],
              default: 'right'
            }
          }
        },
        callback: { type: 'function', required: true }
      }
    });
    function fire(options, callback) {
      console.log('%s fires %s!', options.id, options.direction);
      callback(null, options);
    });

The two properties in the JSON-schema for "fire" represent the arguments going
to the "fire" method. The first argument is an options hash, and the second is
a callback. Both options are expected to be strings and have defaults.
"direction" is an enum, meaning it can only be one of the four specified values.
The callback is required.

Given this schema, your method will complain if you pass bad arguments into
it:

    > creature.fire({})
    Error: Invalid arguments for method `creature.fire`. [
      {
        "attribute": "required",
        "property": "callback",
        "expected": true,
        "message": "is required"
      }
    ]
        at execute (/home/josh/dev/bigcompany/resource/index.js:569:29)
        at /home/josh/dev/bigcompany/resource/index.js:443:16
        at beforeHooks (/home/josh/dev/bigcompany/resource/index.js:505:16)
        at /home/josh/dev/bigcompany/resource/index.js:434:14
        at beforeAllHooks (/home/josh/dev/bigcompany/resource/index.js:474:16)
        at EventEmitter.fn [as fire] (/home/josh/dev/bigcompany/resource/index.js:425:12)
        at repl:1:11
        at REPLServer.self.eval (repl.js:109:21)
        at Interface.<anonymous> (repl.js:248:12)
        at Interface.EventEmitter.emit (events.js:96:17)

    > creature.fire({ direction: 'pony' }, function (err) { if (err) { throw err; }});
    Error: Invalid arguments for method `creature.fire`. [
      {
        "attribute": "enum",
        "property": "direction",
        "expected": [
          "up",
          "down",
          "left",
          "right"
        ],
        "actual": "pony",
        "message": "must be present in given enumerator"
      }
    ]
        at execute (/home/josh/dev/bigcompany/resource/index.js:569:29)
        at /home/josh/dev/bigcompany/resource/index.js:443:16
        at beforeHooks (/home/josh/dev/bigcompany/resource/index.js:505:16)
        at /home/josh/dev/bigcompany/resource/index.js:434:14
        at beforeAllHooks (/home/josh/dev/bigcompany/resource/index.js:474:16)
        at EventEmitter.fn [as fire] (/home/josh/dev/bigcompany/resource/index.js:425:12)
        at repl:1:10
        at REPLServer.self.eval (repl.js:109:21)
        at rli.on.self.bufferedCmd (repl.js:258:20)
        at REPLServer.self.eval (repl.js:116:5)
    > 

and it will fill in properties on object arguments with defaults as well:

    > creature.fire({}, function (err, opts) { if (err) { throw err; } console.log(opts); })
    a creature fires right
    { id: 'a creature', direction: 'right' }

## Adding Properties and Enabling Persistence

The [`resource`](https://github.com/bigcompany/resource) library has a built-in
api for enabling persistence, backed by
[JugglingDB](https://github.com/1602/jugglingdb) that is very simple to use and
integrates nicely with resources.

First, define properties on the resource:

    creature.property('type', {
      description: 'the type of animal',
      type: 'string',
      enum: [ 'pony', 'barracuda', 'alligator' ],
      default: 'alligator'
    });

Then, turn on persistence with a given backend (here we'll use the file system):

    creature.persist('fs');

This automatically adds new methods to creature which allow you to do CRUD
operations for instances of creature:

    > creature.create({ id: 'alligatrix' }, function (err, alligatrix) {
    ... if (err) {
    ..... throw err;
    ..... }
    ... console.log(JSON.stringify(alligatrix))
    ... });
    undefined
    > {"id":"alligatrix","type":"alligator"}

Other methods include "get", "update", "createOrUpdate", "find", "all" and
"destroy".

    > creature.get('alligatrix', console.log);
    undefined
    > null { id: [Getter/Setter], type: [Getter/Setter] }

    > creature.all(function (err, creatures) {
    ... if (err) {
    ..... throw err;
    ..... }
    ... console.log(creatures.map(JSON.stringify));
    ... });
    undefined
    > [ '{"id":"alligatrix","type":"alligator"}' ]

    creature.destroy('alligatrix', console.log);
    undefined
    > null null

These also use their property schemas for validation. For example:

    > creature.create({ id: 'korben', type: 'parakeet' }, function (err, c) {
    ... if (err) {
    ..... throw err;
    ..... }
    ... console.log(c);
    ... });
    Error: Invalid arguments for method `creature.create`. [
      {
        "attribute": "enum",
        "property": "type",
        "expected": [
          "pony",
          "barracuda",
          "alligator"
        ],
        "actual": "parakeet",
        "message": "must be present in given enumerator"
      }
    ]
        at execute (/home/josh/dev/bigcompany/resource/index.js:569:29)
        at /home/josh/dev/bigcompany/resource/index.js:443:16
        at beforeHooks (/home/josh/dev/bigcompany/resource/index.js:505:16)
        at /home/josh/dev/bigcompany/resource/index.js:434:14
        at beforeAllHooks (/home/josh/dev/bigcompany/resource/index.js:474:16)
        at EventEmitter.fn [as create] (/home/josh/dev/bigcompany/resource/index.js:425:12)
        at repl:1:10
        at REPLServer.self.eval (repl.js:109:21)
        at rli.on.self.bufferedCmd (repl.js:258:20)
        at REPLServer.self.eval (repl.js:116:5)

This example uses the `fs` persistence engine, but others (such as the `memory`
and `couchdb` engines) attach the same methods with the same API.

## Emit Events

Resources are also event emitters. In fact, they are
[ee2 namespaced event emitters](https://github.com/hij1nx/eventemitter2). If you
want to emit events on them, you can do so like normal:

    > creature.once('full', function (data) { console.log('I am full of food!'); });


    > creature.emit('full', {})
    I am full of food!
    true

When methods are called, they automatically emit events containing the results:

    > creature.onAny(function (data) { console.log('creature event: ' + this.event); });


    > creature.talk('hello everybody!');
    hello everybody!
    creature event: talk
    'hello everybody!'

These events are also emitted on the resource module itself (which is useful
for listening for events from other resources):

    > resource.onAny(function (data) { console.log('resource event: ' + this.event); });


    > creature.talk('oink');
    oink!
    creature event: talk
    resource event: creature::talk
    'oink'

## Resource Methods are Hookable

Resource methods also have `before` and `after` hooks, for observing and
modifying both inputs and outputs.

    var resource = require('resource'),
        creature = resource.define('creature');

    creature.persist('memory');

    creature.before('create', function (data, next) {
      console.log('before creature.create')
      data.id += '-a';
      next(null, data)
    });

    creature.after('create', function (data, next) {
      console.log('after creature.create')
      data.foo = "bar";
      next(null, data);
    });

    creature.create({ id: 'bobby' }, function (err, result) {
      console.log(err, result);
    });

This will output:

    before creature.create
    after creature.create
    null { id: 'bobby-a', foo: 'bar' }

It's also possible to use `Resource.before` to prevent a resource method from
being called based on incoming data. This is particularly useful for adding
additional asserts.

## Using Resources

Big comes with
[a standard library of resources](https://github.com/bigcompany/resources), all
designed to build upon each other in a consistent way.

To use one of these resources, call `big.use`:

    var big = require('big'),
        http = resource.use('http');

This will create a local copy of the `http` resource in your application's home
directory. From here you can easily make changes to a copy of the resource,
specific to your application. It is also possible to use node's native `require`
function, but this will not create a local copy of the resource.

## Lazy npm Dependencies

Resources support lazily installed npm dependencies. This means that you can
specify which npm dependencies are required per resource and any methods defined
on that resource will automatically defer execution until those npm dependencies
are met:

    var resource = require('resource'),
        http = resource.define('http');

    http.dependencies = {
      "express": "*"
    };

Even though this resource requires express, the developer doesn't have to
install it and Big won't install it until you actually use it.

## Reflect Resources

Before, we used resource method schemas just to add validation. However, these
schemas also make it so that the expected arguments are introspectable. When
you define a method schema, it gets attached to the method:

    > creature.fire.schema
    { description: 'fires a lazer at a certain power and direction',
      properties: { options: { type: 'object', properties: [Object], callback: [Object] } } }

Because of this, we can *reflect* resources over other interfaces by
iterating over these schemas. For example, if you run the following program:

    var big = require('big'),
        creature = big.use('creature'),
        cli = big.use('cli');

    big.cli.start(function () {
      big.cli.route();
    });

It will lazily install the dependencies for the cli resource and then reflect
*all* the resources over a cli:

    $ node cli-example.js 
    info: installing creature to /home/josh/dev/bigcompany/tweetmygithub.com/resources/creature
    info: installing cli to /home/josh/dev/bigcompany/tweetmygithub.com/resources/cli
    warn: cli resource is missing a required dependency: prompt-lite
    warn: cli resource is missing a required dependency: optimist
    warn: cli resource is missing a required dependency: colors
    warn: spawning npm to install missing dependencies
    exec: npm install prompt-lite@0.1.x optimist@0.3.5 colors@*
    warn: deffering execution of `cli.start` since dependencies are missing
    npm http GET https://registry.npmjs.org/prompt-lite
    npm http GET https://registry.npmjs.org/colors
    npm http GET https://registry.npmjs.org/optimist/0.3.5
    npm http 304 https://registry.npmjs.org/colors
    npm http 304 https://registry.npmjs.org/optimist/0.3.5
    npm http 200 https://registry.npmjs.org/prompt-lite
    npm http GET https://registry.npmjs.org/prompt-lite/-/prompt-lite-0.1.1.tgz
    npm http 200 https://registry.npmjs.org/prompt-lite/-/prompt-lite-0.1.1.tgz
    npm http GET https://registry.npmjs.org/revalidator
    npm http GET https://registry.npmjs.org/wordwrap
    npm http GET https://registry.npmjs.org/async
    npm http 304 https://registry.npmjs.org/wordwrap
    npm http 304 https://registry.npmjs.org/revalidator
    npm http 304 https://registry.npmjs.org/async
    colors@0.6.0-1 node_modules/colors

    optimist@0.3.5 node_modules/optimist
    └── wordwrap@0.0.2

    prompt-lite@0.1.1 node_modules/prompt-lite
    ├── revalidator@0.1.5
    └── async@0.1.22
    info: npm just exited with code 0
    info: npm installation complete
    warn: now executing 1 defferred call(s)
    info: resources
    info:  - cli provides a command line interface
    info:  - creature example resource for creatures like dragons, unicorns, and ponies
    info:  - logger a simple STDOUT based logger
    help: type a resource name to explore it
    info: commands
    info:  - cli
    info:  - cli start
    info:  - cli createRouter
    info:  - creature
    info:  - creature create
    info:  - creature get
    info:  - creature find
    info:  - creature all
    info:  - creature update
    info:  - creature updateOrCreate
    info:  - creature destroy
    info:  - creature poke
    info:  - creature fire
    info:  - creature talk
    info:  - logger
    info:  - logger log
    help: type a command to execute it
    $

Here's what happens when I use it to call `creature.talk`:

    $ node cli-example.js creature talk
    info: executing creature method talk
    help: talk - echos back a string
    prompt: text:  (hello!) meow!
    info: executed talk
    data: { text: 'meow!', status: 200 }
    $

If you run this program instead, it will reflect the same resources over a
web interface (after installing express):

    var big = require('big');

    big.use('admin');

    big.use('creature');

    big.admin.start(function (err, server) {
      var address = server.address();

      big.logger.info('http://' + address.address + ":" + address.port + '/admin');
    });

![html admin](/images/2013-05-28-big-admin.png)

You can reflect these same resources over pretty much anything. `resources`
ships with reflection support for: [cli](https://github.com/bigcompany/resources/tree/master/cli), [irc](https://github.com/bigcompany/resources/tree/master/irc), [form](https://github.com/bigcompany/resources/tree/master/form), [socket](https://github.com/bigcompany/resources/tree/master/socket), [rest](https://github.com/bigcompany/resources/tree/master/rest), and [many more](https://github.com/bigcompany/resources).

## Maybe Not Everything is Terrible

Resources represent an alternative to API mapping, by getting rid of the
cognitive dissonance present when trying to integrate disparate modules.
Resources were written from the ground up to expose a standardized interface,
meaning every resource meets some set of expectations regarding how they work.
By exposing events, hooks and argument schemas, resources are highly
introspectable and are very easy to integrate with other resources. Validation
helps not only to sanitize inputs but also to make it easier to integrate code
by exposing a well-documented interface. By including persistence, they also
take care of database integration code.

Resources are also nice because they're written as a curated group of components
which take advantage of the resource API to work together in a clean and elegant
way. By lazily installing dependencies, big is able to include powerful
functionality without including half of npm or requiring the user to install a
bunch of extra modules.

Because of this, resources represent an obvious way to do a given task and
decreases the amount of low-level decisions a developer *needs* to make. Yet,
because of the hookability and clean API of resources, if a developer wants to
handle a task on a low level, big doesn't get in the way.

It is the best of both worlds.

## Links

* [https://github.com/bigcompany/big](https://github.com/bigcompany/big)
* [https://github.com/bigcompany/resource](https://github.com/bigcompany/resource)
* [https://github.com/bigcompany/resources](https://github.com/bigcompany/resources)
