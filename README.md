# LESS Inline SVG Code

This mixin allows you to embed SVG code within CSS files using LESS. The techniques within this mixin relate to the insights found at CSS Tricks' "[Probably Don't Base64 SVG](https://css-tricks.com/probably-dont-base64-svg/)".

You can read more about my development of this mixin on my blog: "[Inline SVG code within CSS using LESS](http://blog.lvl99.com/)"

```less
// Inline SVG code images in LESS CSS
// @author Matt Scheurich <matt@lvl99.com> (http://lvl99.com)
// Github: https://github.com/lvl99/less-inline-svg-code
.inline-svg-code( @code ) {
  @-svg-code: escape(~'<?xml version="1.0" ?>@{code}');
  @-inline-svg-code: ~'data:image/svg+xml,@{-svg-code}';
  @-inline-svg-url: ~"url('@{-inline-svg-code}')";
}
```

## Installation

Simply copy+paste the mixin code above into your workflow, or download and `@import` the [inline-svg-code.less](less/inline-svg-code.less) file into your LESS build.


## Usage

Since LESS doesn't support custom returning functions like SCSS, it does support mixins as functions. By using the `.inline-svg-code` mixin to set specific variables, the referring class/mixin can then reference one of three values:

| Variable             | Description | Example |
|----------------------|-------------|---------|
| `@-svg-code`         | The given SVG code (with added XML header) URL-encoded | `<?xml version="1.0" ?>...` |
| `@-inline-svg-code`  | The whole encoded string of the inlined SVG image | `data:image/svg+xml,@{-svg-code}` |
| `@-inline-svg-url`   | A `url()` encased version of the inlined SVG image code | `url('@{-inline-svg-code}')` |


## Examples

### Basic usage

```less
.example-1 {
  display: block;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  overflow: hidden;
  text-align: left;
  text-indent: -999em;

  // Encode the SVG image code into a string which can be used within this class declaration
  .inline-svg-code(~'<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 600 600" preserveAspectRatio="xMin yMin"><g><rect fill="white" stroke="#000" stroke-width="1.5" x="110.75" y="299.25" width="180" height="180" id="rectangle"/><circle fill="white" stroke="#000" stroke-width="1.5" cx="300" cy="300" r="107.5" id="circle"/><path fill="white" stroke="#000" stroke-width="1.5" d="m430.75,120.75l-123.5,176l242,0l-118.5,-176z" id="triangle"/></g></svg>');

  // Apply the background image using the `@-inline-svg-url` variable
  background-image: @-inline-svg-url;
}
```

Outputs as:

```css
.example-1 {
  display: block;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  overflow: hidden;
  text-align: left;
  text-indent: -999em;
  background-image: url('data:image/svg+xml,%3C?xml%20version%3D%221.0%22%20?%3E%3Csvg%20width%3D%22600%22%20height%3D%22600%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewbox%3D%220%200%20600%20600%22%20preserveAspectRatio%3D%22xMin%20yMin%22%3E%3Cg%3E%3Crect%20fill%3D%22white%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20x%3D%22110.75%22%20y%3D%22299.25%22%20width%3D%22180%22%20height%3D%22180%22%20id%3D%22rectangle%22/%3E%3Ccircle%20fill%3D%22white%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20cx%3D%22300%22%20cy%3D%22300%22%20r%3D%22107.5%22%20id%3D%22circle%22/%3E%3Cpath%20fill%3D%22white%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20d%3D%22m430.75,120.75l-123.5,176l242,0l-118.5,-176z%22%20id%3D%22triangle%22/%3E%3C/g%3E%3C/svg%3E');
}
```

### Dynamic Example

```less
// I've created a dynamic mixin to generate consistent SVG image code that can support color changes
.example-inline-svg( @color-triangle: white, @color-square: white, @color-circle: white ) {
  @example-svg-code: ~'<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 600 600" preserveAspectRatio="xMin yMin"><g><rect fill="@{color-square}" stroke="#000" stroke-width="1.5" x="110.75" y="299.25" width="180" height="180" id="rectangle"/><circle fill="@{color-circle}" stroke="#000" stroke-width="1.5" cx="300" cy="300" r="107.5" id="circle"/><path fill="@{color-triangle}" stroke="#000" stroke-width="1.5" d="m430.75,120.75l-123.5,176l242,0l-118.5,-176z" id="triangle"/></g></svg>';

  // Here I apply the inline SVG code mixin to retrieve the encoded URL to set as the background-image
  .inline-svg-code(@example-svg-code);
  background-image: @-inline-svg-url;
}

.example-2 {
  display: block;
  width: 100%;
  height: 300px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  overflow: hidden;
  text-align: left;
  text-indent: -999em;

  // Here I set the initial state, which will be based on the default color values
  .example-inline-svg();
}

// Let's do some further customisation based on responsive widths...
@media screen and (min-width: 500px) and (max-width: 799px) {
  .example-2 {
    // Let's go RGB, bebe
    .example-inline-svg(red, green, blue);
  }
}

@media screen and (min-width: 800px) and (max-width: 1199px) {
  .example-2 {
    // How 'bout some red, white and blue (Viva la France!)
    .example-inline-svg(red, white, blue);
  }
}

@media screen and (min-width: 1200px) {
  .example-2 {
    // Greyscale for fun
    .example-inline-svg(black, grey, white);
  }
}
```

Outputs as:

```css
.example-2 {
  display: block;
  width: 100%;
  height: 300px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  overflow: hidden;
  text-align: left;
  text-indent: -999em;
  background-image: url('data:image/svg+xml,%3C?xml%20version%3D%221.0%22%20?%3E%3Csvg%20width%3D%22600%22%20height%3D%22600%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewbox%3D%220%200%20600%20600%22%20preserveAspectRatio%3D%22xMin%20yMin%22%3E%3Cg%3E%3Crect%20fill%3D%22white%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20x%3D%22110.75%22%20y%3D%22299.25%22%20width%3D%22180%22%20height%3D%22180%22%20id%3D%22rectangle%22/%3E%3Ccircle%20fill%3D%22white%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20cx%3D%22300%22%20cy%3D%22300%22%20r%3D%22107.5%22%20id%3D%22circle%22/%3E%3Cpath%20fill%3D%22white%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20d%3D%22m430.75,120.75l-123.5,176l242,0l-118.5,-176z%22%20id%3D%22triangle%22/%3E%3C/g%3E%3C/svg%3E');
}
@media screen and (min-width: 500px) and (max-width: 799px) {
  .example-2 {
    background-image: url('data:image/svg+xml,%3C?xml%20version%3D%221.0%22%20?%3E%3Csvg%20width%3D%22600%22%20height%3D%22600%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewbox%3D%220%200%20600%20600%22%20preserveAspectRatio%3D%22xMin%20yMin%22%3E%3Cg%3E%3Crect%20fill%3D%22green%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20x%3D%22110.75%22%20y%3D%22299.25%22%20width%3D%22180%22%20height%3D%22180%22%20id%3D%22rectangle%22/%3E%3Ccircle%20fill%3D%22blue%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20cx%3D%22300%22%20cy%3D%22300%22%20r%3D%22107.5%22%20id%3D%22circle%22/%3E%3Cpath%20fill%3D%22red%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20d%3D%22m430.75,120.75l-123.5,176l242,0l-118.5,-176z%22%20id%3D%22triangle%22/%3E%3C/g%3E%3C/svg%3E');
  }
}
@media screen and (min-width: 800px) and (max-width: 1199px) {
  .example-2 {
    background-image: url('data:image/svg+xml,%3C?xml%20version%3D%221.0%22%20?%3E%3Csvg%20width%3D%22600%22%20height%3D%22600%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewbox%3D%220%200%20600%20600%22%20preserveAspectRatio%3D%22xMin%20yMin%22%3E%3Cg%3E%3Crect%20fill%3D%22white%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20x%3D%22110.75%22%20y%3D%22299.25%22%20width%3D%22180%22%20height%3D%22180%22%20id%3D%22rectangle%22/%3E%3Ccircle%20fill%3D%22blue%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20cx%3D%22300%22%20cy%3D%22300%22%20r%3D%22107.5%22%20id%3D%22circle%22/%3E%3Cpath%20fill%3D%22red%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20d%3D%22m430.75,120.75l-123.5,176l242,0l-118.5,-176z%22%20id%3D%22triangle%22/%3E%3C/g%3E%3C/svg%3E');
  }
}
@media screen and (min-width: 1200px) {
  .example-2 {
    background-image: url('data:image/svg+xml,%3C?xml%20version%3D%221.0%22%20?%3E%3Csvg%20width%3D%22600%22%20height%3D%22600%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewbox%3D%220%200%20600%20600%22%20preserveAspectRatio%3D%22xMin%20yMin%22%3E%3Cg%3E%3Crect%20fill%3D%22grey%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20x%3D%22110.75%22%20y%3D%22299.25%22%20width%3D%22180%22%20height%3D%22180%22%20id%3D%22rectangle%22/%3E%3Ccircle%20fill%3D%22white%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20cx%3D%22300%22%20cy%3D%22300%22%20r%3D%22107.5%22%20id%3D%22circle%22/%3E%3Cpath%20fill%3D%22black%22%20stroke%3D%22%23000%22%20stroke-width%3D%221.5%22%20d%3D%22m430.75,120.75l-123.5,176l242,0l-118.5,-176z%22%20id%3D%22triangle%22/%3E%3C/g%3E%3C/svg%3E');
  }
}
```

## License

Copyright © 2016 Matt Scheurich <<matt@lvl99.com>>

This work is free. You can redistribute it and/or modify it under the terms of the Do What The Fuck You Want To Public License, Version 2, as published by Sam Hocevar. See the [LICENSE](LICENSE) file for more details.
