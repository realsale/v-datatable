# vjs-datatable

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
npm install vjs-datatable --save
```

## Import

> ### Global
>
> ```js
> import Vue from "vue";
> import App from "./App.vue";
> import DataTable from "vjs-datatable";
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
> import DataTable from "vjs-datatable";
>
> export default {
>   components: {
>     DataTable
>   }
> };
> </script>
> ```
>
> ### CDN
>
> ```html
> <!-- peer dependency -->
> <script src="https://cdn.jsdelivr.net/npm/vue@^2.6.11/dist/vue.min.js"></script>
> <!-- vjs-datatable -->
> <script src="https://cdn.jsdelivr.net/npm/vjs-datatable@0.1.0/dist/vjs-datatable.umd.min.js"></script>
> 
> <script>
>   new Vue({
>     el: "#app",
>     components: {
>       DataTable: window["vjs-datatable"]
>     }
>   });
> </script>
> ```

## Usage

> ### SFC
>
> ```html
> <template>
>   <DataTable :data="rows" :columns="columns" />
> </template>
> ```
>
> ### DOM
>
> ```html
> <body>
>   <data-table :data="rows" :columns="columns"></data-table>
> </body>
> ```

## Props

| Name                      | Type                         | Default            | Description                                                                                                                                                                                                                                                                                                                                              |
| ------------------------- | ---------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                      | Array                        |                    | Should array of objects accepts non-uniform data structure as long as defined field(s) is/are present.                                                                                                                                                                                                                                                   |
| columns                   | Array                        |                    | Array of objects describing a column                                                                                                                                                                                                                                                                                                                     |
| columns[].field           | String                       |                    | Path to an obj key and slot name for providing alternative content                                                                                                                                                                                                                                                                                       |
| columns[].label           | String                       | field value        | Header name <br /><br /> Note: If field is in dot notation then the default value is the root level                                                                                                                                                                                                                                                      |
| columns[].sortable        | Boolean                      | false              | Allow a column to be sorted                                                                                                                                                                                                                                                                                                                              |
| columns[].type            | String(string\|number\|date) | string             | Specify data type to be sorted                                                                                                                                                                                                                                                                                                                           |
| columns[].searchable      | Boolean                      | false              | Make a column searchable <br /><br /> Note: Searchable columns are all affected by search filter <br /><br /> Note: Search will filter the original data, disregard the transformation made by slot content                                                                                                                                             |
| columns[].format          | Function                     |                    | A function that modifies a data in a specific column <br /><br /> Note: Formatted data affects the sort and search filter <br /><br /> Crit: Be careful of changing the data type if you're going to use a sort feature. If you have a column with type option defined to number and suddenly formats a data to any valid type, then sort might not work |
| initialSort               | Object                       |                    | Object specifying the field and order of column to be sorted initially                                                                                                                                                                                                                                                                                   |
| initialSort.field         | String                       |                    | A sortable column field that going to initially sorted <br /><br /> Note: Specifying the field that didn't set sortable key to true, will not work.                                                                                                                                                                                                      |
| initialSort.dir           | String                       |                    | A sorting direction <br /><br /> Note: Even though you didn't specify or skip or emptied or supply invalid value on either fields, it will not throw an error, but initial sorting will not work.                                                                                                                                                        |
| reverseSort               | Boolean                      | false              | Reverse the sort direction, desc to asc                                                                                                                                                                                                                                                                                                                  |
| allowNoSort               | Boolean                      | false              | Boolean specifies the none sort order <br /><br /> Info: None sort order returns the original order of data                                                                                                                                                                                                                                              |
| rowSelect                 | Boolean                      | false              | Allows the rows to be selected via checkbox                                                                                                                                                                                                                                                                                                              |
| rowDetail                 | Boolean                      | false              | Specifying the ability to provide additional content(accordion) by means of slot(v-slot:row-detail="{row}")                                                                                                                                                                                                                                              |
| dtClasses                 | Object                       |                    | An object specifying a class names to be customized                                                                                                                                                                                                                                                                                                      |
| mergeDefault              | Boolean                      | true               | A boolean that determines whether to merge a default class if classes(dtClasses, pagClasses) prop is partially supplied or not                                                                                                                                                                                                                           |
| noRecordMessage           | String                       | No records to show | A message to be display if rows are empty                                                                                                                                                                                                                                                                                                                |
| pagination                | Object                       |                    | Object specifying the initial page, per page options and per page value                                                                                                                                                                                                                                                                                  |
| pagination.initialPage    | Number                       | 1                  | Page number on which the data will start                                                                                                                                                                                                                                                                                                                 |
| pagination.perPageOptions | Array                        | [10, 25, 50]       | Array of per page                                                                                                                                                                                                                                                                                                                                        |
| pagination.perPage        | Number                       | 10                 | Number of row per page                                                                                                                                                                                                                                                                                                                                   |
| pagination.pageGoto       | Boolean                      | false              | Specify whether to show/hide pageGoto feature                                                                                                                                                                                                                                                                                                            |
| pagination.pagClasses     | Object                       |                    | An object specifying a class names to be customized                                                                                                                                                                                                                                                                                                                                                         |

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

## Slots

| Name              | Slot Props | Description                                                                                             |
| ----------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| field.nameOfField | row        | An alternative content for each cell on a particular column <br /><br /> Can be use to provide actions  |
| row-detail        | row        | An accordion content for every row <br /><br /> Note: Can only be use if rowDetail option is set to true |                                                                                                    |

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
