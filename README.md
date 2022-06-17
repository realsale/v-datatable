# v-datatable

Datatable component for Vue 2.x

## Features

- Provides a simple to advanced tabular data
- Supports dot notation in field props
- Sorting
  - Typed sorting
  - Has `no-sort` sorting direction/order
  - Initial sorting
  - Reverse sorting
- Pagination
  - Per page options
  - Setting initial per page
  - Setting initial page
  - Goto page input
  - Page details
- Search
- Row select
- Row detail
- Default and Customizable Style

## Install

```bash
npm install v-datatable --save
```

## Import

> ### Global
>
> ```js
> import Vue from "vue";
> import App from "./App.vue";
> import DataTable from "v-datatable";
>
> Vue.use(DataTable);
>
> new Vue({
>   render: (h) => h(App),
> }).$mount("#app");
> ```
>
> ### Component
>
> ```html
> <script>
> import DataTable from "v-datatable";
>
> export default {
>   components: {
>     DataTable
>   }
> };
> </script>
> ```

## Usage

```html
<template>
  <DataTable :data="rows" :columns="columns" />
</template>
```

## Props

| Name                      | Type                         | Default            | Description                                                                                                                                                                                                                                                                                                                                              |
| ------------------------- | ---------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                      | Array                        |                    | Should array of objects accepts non-uniform data structure as long as defined field(s) is/are present.                                                                                                                                                                                                                                                   |
| columns                   | Array                        |                    | array of objects describing a column                                                                                                                                                                                                                                                                                                                     |
| columns[].field           | String                       |                    | path to an obj key and slot name for providing alternative content                                                                                                                                                                                                                                                                                       |
| columns[].label           | String                       | field value        | header name <br /><br /> note: if field is in dot notation then the default value is the root level                                                                                                                                                                                                                                                      |
| columns[].sortable        | Boolean                      | false              | allow a column to be sorted                                                                                                                                                                                                                                                                                                                              |
| columns[].type            | String(string\|number\|date) | string             | specify data type to be sorted                                                                                                                                                                                                                                                                                                                           |
| columns[].searchable      | Boolean                      | false              | make a column searchable <br /><br /> note: searchable columnns are all affected by search filter <br /><br /> note: search will filter the original data, disregard the transformation made by slot content                                                                                                                                             |
| columns[].format          | Function                     |                    | a function that modifies a data in a specific column <br /><br /> note: formatted data affects the sort and search filter <br /><br /> crit: be careful of changing the data type if you're going to use a sort feature. If you have a column with type option defined to number and suddenly formats a data to any valid type, then sort might not work |
| initialSort               | Object                       |                    | object specifying the field and order of column to be sorted initially                                                                                                                                                                                                                                                                                   |
| initialSort.field         | String                       |                    | a sortable column field that going to initially sorted <br /><br /> note: specifying the field that didn't set sortable key to true, will not work.                                                                                                                                                                                                      |
| initialSort.dir           | String                       |                    | a sorting direction <br /><br /> note: even though you didn't specify or skip or emptied or supply invalid value on either fields, it will not throw an error, but initial sorting will not work.                                                                                                                                                        |
| reverseSort               | Boolean                      | false              | reverse the sort direction, desc to asc                                                                                                                                                                                                                                                                                                                  |
| allowNoSort               | Boolean                      | false              | boolean specifies the none sort order <br /><br /> info: none sort order returns the original order of data                                                                                                                                                                                                                                              |
| rowSelect                 | Boolean                      | false              | allows the rows to be selected via checkbox                                                                                                                                                                                                                                                                                                              |
| rowDetail                 | Boolean                      | false              | specifying the ability to provide additional content(accordion) by means of slot(v-slot:row-detail="{row}")                                                                                                                                                                                                                                              |
| dtClasses                 | Object                       |                    | an object specifying a class names to be customized                                                                                                                                                                                                                                                                                                      |
| mergeDefault              | Boolean                      | true               | a boolean that determines whether to merge a default class if classes(dtClasses, pagClasses) prop is partially supplied or not                                                                                                                                                                                                                           |
| noRecordMessage           | String                       | No records to show | a message to be display if rows are empty                                                                                                                                                                                                                                                                                                                |
| pagination                | Object                       |                    | object specifying the initial page, per page options and per page value                                                                                                                                                                                                                                                                                  |
| pagination.initialPage    | Number                       | 1                  | page number on which the data will start                                                                                                                                                                                                                                                                                                                 |
| pagination.perPageOptions | Array                        | [10, 25, 50]       | array of per page                                                                                                                                                                                                                                                                                                                                        |
| pagination.perPage        | Number                       | 10                 | number of row per page                                                                                                                                                                                                                                                                                                                                   |
| pagination.pageGoto       | Boolean                      | false              | specify whether to show/hide pageGoto feature                                                                                                                                                                                                                                                                                                            |
| pagination.pagClasses     | Object                       |                    | an object specifying a class names to be customized                                                                                                                                                                                                                                                                                                                                                         |

## Events

| Name                  | Data                 | Description                                     |
| --------------------- | -------------------- | ----------------------------------------------- |
| on-search             | searchKey, rowCount  | Fires when a search input value change          |
| on-sort               | field, dir           | Fires when a sortable header toggle             |
| on-select             | row, isSelected      | Fires when row checkbox value change            |
| on-select-all         | rows                 | Fires when select all row checkbox value change |
| on-row-detail-change  | row, isRowDetailOpen | Fires when row toggle button click              |
| on-page-change        | pageNumber           | Fires when page change                          |
| on-page-option-change | perPage              | Fires when per page dropdown change             |

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Lints and fixes files

```bash
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
