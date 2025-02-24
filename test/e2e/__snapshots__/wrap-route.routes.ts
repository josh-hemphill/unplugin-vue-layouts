[
  {
    "component": [Function],
    "name": "/",
    "path": "/",
  },
  {
    "component": [Function],
    "name": "/about",
    "path": "/about",
  },
  {
    "children": [
      {
        "children": [
          {
            "component": [Function],
            "meta": {
              "isLayout": false,
              "layout": "custom",
            },
            "name": "/meta_tagged/route_block",
            "path": "",
          },
        ],
        "component": {
          "__file": "./fixtures/layouts/custom.vue",
          "render": [Function],
        },
        "meta": {
          "isLayout": true,
          "layout": "custom",
        },
        "path": "route_block",
      },
    ],
    "path": "/meta_tagged",
  },
  {
    "children": [
      {
        "children": [
          {
            "component": [Function],
            "meta": {
              "isLayout": false,
            },
            "name": "/nested/",
            "path": "",
          },
        ],
        "component": {
          "__file": "./fixtures/layouts/default.vue",
          "render": [Function],
        },
        "meta": {
          "isLayout": true,
        },
        "path": "",
      },
      {
        "children": [
          {
            "component": [Function],
            "meta": {
              "isLayout": false,
            },
            "name": "/nested/foo",
            "path": "",
          },
        ],
        "component": {
          "__file": "./fixtures/layouts/default.vue",
          "render": [Function],
        },
        "meta": {
          "isLayout": true,
        },
        "path": "foo",
      },
    ],
    "path": "/nested",
  },
  {
    "children": [
      {
        "children": [
          {
            "component": [Function],
            "meta": {
              "isLayout": false,
            },
            "name": "/parent/child",
            "path": "",
          },
        ],
        "component": {
          "__file": "./fixtures/layouts/default.vue",
          "render": [Function],
        },
        "meta": {
          "isLayout": true,
        },
        "path": "child",
      },
    ],
    "component": [Function],
    "name": "/parent",
    "path": "/parent",
  },
]