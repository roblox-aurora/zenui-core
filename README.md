# ZenUI Core
Core user interface code for the Zenerith Engine - open sourced for other games using TypeScript to use.


## Controllers
Contains behaviour-oriented components that when built together, will give a behaviour. Currently houses core pieces for pagination/tabs.
- `PageController` - Controller that handles pages
- `TabController` - Handles tab rendering, when used with `PageController` can be used to create tab widgets.

## Views
View objects - currently contains the simplest unit 
- `View` (which is just a frame that defaults to transparent & `UDim2.fromScale(1, 1)` size)

## Layouts
Contains objects which handle layout
- `ColumnView` which will create columns that automatically size, each column can also have a specified size, in which other columns will automatically size to.