# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--

## [Unreleased]

### Added 

### Fixed

-->

## [1.3.1] - 2023-01-08

### Changed

- Now c3tools.js (and its minified version) uses c3tools-min.m.js, instead of c3tools.m.js.

## [1.3.0] - 2023-01-08

### Added

- `c3tools` wrapper export for all modules.

## [1.2.0] - 2023-01-08

### Added

- `DOMQuerying` logical module.
- `DOMGenerators` logical module.
- `Fetching` logical module.
- `Shortcuts` logical module.
- `TypeChecking` logical module.

## [1.1.0] - 2022-12-26

### Added

- `superFetch` function.

### Deprecated

- `sendJSON` function.
- `sendPOST` function.
- `fetchConCredentials` function.

## [1.0.1] - 2022-12-26

### Changed

- Better JSDocs.
- `B` is now a constant. Technically this should be breaking change, but nobody should have used this as a variable, it was intended to be a constant.

### Removed

- `DOMContentLoaded` event listener for `B`.
- Redundant redefinition of `B` on c3tools.js.

## [1.0.0] - 2022-12-18

### Added

- ES6 module version.

### Changed

- Now you must add `type="module"` to your script tags.

## [1.0.0-alpha.1] - 2021-11-20

### Added

- `addElement` now throws an error if the first parameter is not an HTMLElement.

### Changed

- Completed JSDocs comments.
- `is` now uses `Types` for comparisons.
- Functions returning null or false on errors or bad parameters now throw proper errors. These are `SqS`, `createElement` and `JSONAsFormData`.
- `SqS` now returns an HTMLElement or an array of them.
- `createElement` now adds all the children at the same time, using a DocumentFragment.
- `fetchConCredentials` now has a default value for the `options` parameter.

### Removed

- `last` function.

### Fixed

- `sendPOST` doesn't break if the deconstructed parameter is null.

## [1.0.0-alpha.0] - 2021-08-14

### Added

- `W` constant.
- `D` constant.
- `ALL` constant.
- `ONLY_ONE` constant.
- `B` variable.
- `Types` variable.
- `DOMContentLoaded` event listener for `B`.
- `is` function.
- `whatIs` function.
- `gEt` arrow function constant.
- `SqS` function.
- `last` function.
- `createElement` function.
- `sendJSON` function.
- `JSONAsURLEncodedStringIterator` iterator function.
- `JSONAsFormData` function.
- `sendPOST` function.
- `fetchConCredentials` function.