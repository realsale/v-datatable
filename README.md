# v-datatable

Datatable component for Vue 2.x

## Features

- Provides a simple to advanced tabular data
- Supports dot notation in field props
- Sorting
  - Typed sorting
  - Has no-sort sorting direction/order
  - Initial sorting
  - Reverse sorting
- Pagination
  - Per page options
  - Setting initial per page
  - Setting initial page
  - Goto page input
  - Page details
- Search

## Props

| Name                      | Type                 | Default      | Description                                                                                                                                                                                                  |
| ------------------------- | -------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data                      | Array                |              | Should array of objects accepts non-uniform data structure as long as defined field(s) is/are present.                                                                                                       |
| columns                   | Array                |              | array of objects describing a column                                                                                                                                                                         |
| columns[].field           | String               |              | path to an obj key and slot name for providing alternative content                                                                                                                                           |
| columns[].label           | String               | field value  | header name <br /><br /> note: if field is in dot notation then the default value is the root level                                                                                                          |
| columns[].sortable        | Boolean              | false        | allow a column to be sorted                                                                                                                                                                                  |
| columns[].type            | String(data\|number) | string       | specify data type to be sorted                                                                                                                                                                               |
| columns[].searchable      | Boolean              | false        | make a column searchable <br /><br /> note: searchable columnns are all affected by search filter <br /><br /> note: search will filter the original data, disregard the transformation made by slot content |
| initialSort               | Object               |              | object specifying the field and order of column to be sorted initially                                                                                                                                       |
| initialSort.field         | String               |              | a sortable column field that going to initially sorted <br /><br /> note: specifying the field that didn't set sortable key to true, will not work.                                                    |
| initialSort.dir           | String               |              | a sorting direction <br /><br /> note: even though you didn't specify or skip or emptied or supply invalid value on either fields, it will not thrown an error, but initial sorting will not work.           |
| reverseSort               | Boolean              | false        | reverse the sort direction, desc to asc                                                                                                                                                                      |
| allowNoSort               | Boolean              | false        | boolean specifies the none sort order <br /><br /> info: none sort order returns the original order of data                                                                                                  |
| pagination                | Object               |              | object specifying the initial page, per page options and per page value                                                                                                                                      |
| pagination.initialPage    | Number               | 1            | page number on which the data will start                                                                                                                                                                     |
| pagination.perPageOptions | Array                | [10, 25, 50] | array of per page                                                                                                                                                                                            |
| pagination.perPage        | Number               | 10           | number of row per page                                                                                                                                                                                       |

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
