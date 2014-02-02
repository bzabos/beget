# Path mapping

Here's the issue...

## We want to be able to reference lib stuff from within root of project:
* /lib/backbone/backbone.js => w.backbone.View => ">backbone.View" [OR]
* /lib/backbone/src/View.js => w.backbone.View => "/backbone.View"
## We want to be able to reference local src stuff:
* /src/Models/Beget.js as /Models/Beget => w.beget => "/Beget"
## We want to be able to reference global stuff:
* /node_modules/underscore/underscore.js => w.underscore => ">underscore"

###More issues:
* We don't want to use any crazy conventions.


## Include Scenarios:

### require(backbone)
* modules/backbone/{main}.js \[OR\]
* modules/backbone/index.js

### require(backbone/some-file)
* modules/backbone/some-file.js

### require(./backbone/some-file)
* ./backbone/some-file.js

### w.backbone

### w\[/backbone/View\]



###Structures:
NOTE: Lib is part of {some-project}, and would (likely?) be a part of this namespace
* {project-name}/src/lib/helpers/SomeClass.js
* {project-name}/src/views/SomeView.js
* {project-name}/test/views/SomeViewTest.js
* modules/{project-name}/src/views/SomeView.js
* modules/backbone/backbone.js


Maybe modules start at the root => /src/**

* w[/beget].beget === (w.beget).beget === beget/src/beget || ./src/beget
* w[/beget/src/views/SomeView]


## Verdict:
Our namespace should be in the form: {project-name}/src/{path}/{Class}

We'll add in the concept of namespace mapping and traversal paths later, but for now, keep it simple and map directly to filepath.
