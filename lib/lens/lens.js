!function() {
    return function t(e, n, i) {
        function o(s, a) {
            if (!n[s]) {
                if (!e[s]) {
                    var c = "function" == typeof require && require;
                    if (!a && c)
                        return c(s, !0);
                    if (r)
                        return r(s, !0);
                    var l = new Error("Cannot find module '" + s + "'");
                    throw l.code = "MODULE_NOT_FOUND",
                    l
                }
                var u = n[s] = {
                    exports: {}
                };
                e[s][0].call(u.exports, function(t) {
                    return o(e[s][1][t] || t)
                }, u, u.exports, t, e, n, i)
            }
            return n[s].exports
        }
        for (var r = "function" == typeof require && require, s = 0; s < i.length; s++)
            o(i[s]);
        return o
    }
}()({
    1: [function(t, e, n) {
        window.Lens = t("./src/sps-lens");
        !function() {
            for (var t = {}, e = window.location.search.substring(1).split("&"), n = 0; n < e.length; n++) {
                var i = e[n].split("=");
                if (void 0 === t[i[0]])
                    t[i[0]] = i[1];
                else if ("string" == typeof t[i[0]]) {
                    var o = [t[i[0]], i[1]];
                    t[i[0]] = o
                } else
                    t[i[0]].push(i[1])
            }
        }()
    }
    , {
        "./src/sps-lens": 243
    }],
    2: [function(t, e, n) {}
    , {}],
    3: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../substance/util")
          , r = t("../substance/document")
          , s = function(t) {
            t = s.prepareOptions(t),
            r.call(this, t),
            this.bySourceId = this.addIndex("by_source_id", {
                property: "source_id"
            }),
            this.nodeTypes = t.nodeTypes,
            void 0 === t.seed && (this.create({
                id: "document",
                type: "document",
                guid: t.id,
                creator: t.creator,
                created_at: t.created_at,
                views: s.views,
                title: "",
                abstract: "",
                authors: []
            }),
            i.each(s.views, function(t) {
                this.create({
                    id: t,
                    type: "view",
                    nodes: []
                })
            }, this))
        };
        s.Prototype = function() {
            this.fromSnapshot = function(t, e) {
                return s.fromSnapshot(t, e)
            }
            ,
            this.getNodeBySourceId = function(t) {
                var e = this.bySourceId.get(t);
                return e[Object.keys(e)[0]]
            }
            ,
            this.getHeadings = function() {
                return i.filter(this.get("content").getNodes(), function(t) {
                    return "heading" === t.type
                })
            }
            ,
            this.getTocNodes = function() {
                return i.filter(this.get("content").getNodes(), function(t) {
                    return t.includeInToc()
                })
            }
        }
        ,
        s.prepareOptions = function(t) {
            return (t = t || {}).nodeTypes = i.extend(s.nodeTypes, t.nodeTypes),
            t.schema = s.getSchema(t.nodeTypes),
            t
        }
        ,
        s.getSchema = function(t) {
            var e = o.deepclone(r.schema);
            return e.id = "lens-article",
            e.version = "2.0.0",
            i.each(t, function(t, n) {
                e.types[n] = t.Model.type
            }),
            e
        }
        ,
        s.fromSnapshot = function(t, e) {
            return (e = e || {}).seed = t,
            new s(e)
        }
        ,
        s.views = ["content", "figures", "citations", "definitions", "info"],
        s.nodeTypes = t("./nodes"),
        s.ViewFactory = t("./view_factory"),
        s.ResourceView = t("./resource_view");
        var a = {
            id: "lens_article",
            nodes: {
                document: {
                    type: "document",
                    id: "document",
                    views: ["content"],
                    title: "The Anatomy of a Lens Article",
                    authors: ["contributor_1", "contributor_2", "contributor_3"],
                    guid: "lens_article"
                },
                content: {
                    type: "view",
                    id: "content",
                    nodes: ["cover"]
                },
                cover: {
                    id: "cover",
                    type: "cover"
                },
                contributor_1: {
                    id: "contributor_1",
                    type: "contributor",
                    name: "Michael Aufreiter"
                },
                contributor_2: {
                    id: "contributor_2",
                    type: "contributor",
                    name: "Ivan Grubisic"
                },
                contributor_3: {
                    id: "contributor_3",
                    type: "contributor",
                    name: "Rebecca Close"
                }
            }
        };
        s.describe = function() {
            var t = new s({
                seed: a
            })
              , e = 0;
            return i.each(s.nodeTypes, function(n) {
                var o = "heading_" + (n = n.Model).type.id;
                t.create({
                    id: o,
                    type: "heading",
                    content: n.description.name,
                    level: 1
                });
                var r = n.description.remarks.join(" ")
                  , s = "text_" + n.type.id + "_intro";
                t.create({
                    id: s,
                    type: "text",
                    content: r
                }),
                t.show("content", [o, s], -1),
                t.create({
                    id: o + "_properties",
                    type: "text",
                    content: n.description.name + " uses the following properties:"
                }),
                t.show("content", [o + "_properties"], -1);
                var a = [];
                i.each(n.description.properties, function(n, i) {
                    var o = "text_" + ++e;
                    t.create({
                        id: o,
                        type: "text",
                        content: i + ": " + n
                    }),
                    t.create({
                        id: e + "_annotation",
                        type: "code",
                        path: [o, "content"],
                        range: [0, i.length]
                    }),
                    a.push(o)
                }),
                t.create({
                    id: o + "_property_list",
                    type: "list",
                    items: a,
                    ordered: !1
                }),
                t.show("content", [o + "_property_list"], -1),
                t.create({
                    id: o + "_example",
                    type: "text",
                    content: "Here's an example:"
                }),
                t.create({
                    id: o + "_example_codeblock",
                    type: "codeblock",
                    content: JSON.stringify(n.example, null, "  ")
                }),
                t.show("content", [o + "_example", o + "_example_codeblock"], -1)
            }),
            t
        }
        ,
        s.Prototype.prototype = r.prototype,
        s.prototype = new s.Prototype,
        s.prototype.constructor = s,
        Object.defineProperties(s.prototype, {
            id: {
                get: function() {
                    return this.get("document").guid
                },
                set: function(t) {
                    this.get("document").guid = t
                }
            },
            creator: {
                get: function() {
                    return this.get("document").creator
                },
                set: function(t) {
                    this.get("document").creator = t
                }
            },
            created_at: {
                get: function() {
                    return this.get("document").created_at
                },
                set: function(t) {
                    this.get("document").created_at = t
                }
            },
            title: {
                get: function() {
                    return this.get("document").title
                },
                set: function(t) {
                    this.get("document").title = t
                }
            },
            abstract: {
                get: function() {
                    return this.get("document").abstract
                },
                set: function(t) {
                    this.get("document").abstract = t
                }
            },
            on_behalf_of: {
                get: function() {
                    return this.get("document").on_behalf_of
                },
                set: function(t) {
                    this.get("document").on_behalf_of = t
                }
            },
            authors: {
                get: function() {
                    var t = this.get("document");
                    return t.authors ? i.map(t.authors, function(t) {
                        return this.get(t)
                    }, this) : ""
                },
                set: function(t) {
                    this.get("document").authors = i.clone(t)
                }
            },
            views: {
                get: function() {
                    return this.get("document").views.slice(0)
                }
            }
        }),
        e.exports = s
    }
    , {
        "../substance/document": 171,
        "../substance/util": 180,
        "./nodes": 78,
        "./resource_view": 125,
        "./view_factory": 126,
        underscore: 183
    }],
    4: [function(t, e, n) {
        var i = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December"
        }
          , o = {
            formatDate: function(t) {
                var e = t.split("-");
                if (e.length >= 3)
                    return new Date(e[0],e[1] - 1,e[2]).toDateString().slice(4, 16).replace(/\b0+/g, "");
                if (2 === e.length) {
                    var n = e[1].replace(/^0/, "")
                      , o = e[0];
                    return i[n] + " " + o
                }
                return o
            }
        };
        e.exports = o
    }
    , {}],
    5: [function(t, e, n) {
        "use strict";
        var i = t("./article");
        e.exports = i
    }
    , {
        "./article": 3
    }],
    6: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Node.call(this, t, e)
        };
        o.type = {
            id: "affiliation",
            parent: "content",
            properties: {
                source_id: "string",
                city: "string",
                country: "string",
                department: "string",
                institution: "string",
                label: "string",
                specific_use: "string"
            }
        },
        o.description = {
            name: "Affiliation",
            description: "Person affiliation",
            remarks: ["Name of a institution or organization, such as a university or corporation, that is the affiliation for a contributor such as an author or an editor."],
            properties: {
                institution: "Name of institution",
                department: "Department name",
                country: "Country where institution is located",
                city: "City of institution",
                label: "Affilation label. Usually a number counting up"
            }
        },
        o.example = {
            id: "affiliation_1",
            source_id: "aff1",
            city: "Jena",
            country: "Germany",
            department: "Department of Molecular Ecology",
            institution: "Max Planck Institute for Chemical Ecology",
            label: "1",
            type: "affiliation"
        },
        (o.Prototype = function() {}
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    7: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./affiliation")
        }
    }
    , {
        "./affiliation": 6
    }],
    8: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Node.call(this, t, e)
        };
        o.type = {
            id: "annotation",
            properties: {
                path: ["array", "string"],
                range: ["array", "number"]
            }
        },
        (o.Prototype = function() {
            this.getLevel = function() {
                return this.constructor.fragmentation
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        o.NEVER = 1,
        o.OK = 2,
        o.fragmentation = o.DONT_CARE = 3,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    9: [function(t, e, n) {
        "use strict";
        var i = function(t, e) {
            this.node = t,
            this.viewFactory = e,
            this.el = this.createElement(),
            this.el.dataset.id = t.id,
            this.$el = $(this.el),
            this.setClasses()
        };
        i.Prototype = function() {
            this.createElement = function() {
                return document.createElement("span")
            }
            ,
            this.setClasses = function() {
                this.$el.addClass("annotation").addClass(this.node.type)
            }
            ,
            this.render = function() {
                return this
            }
        }
        ,
        i.prototype = new i.Prototype,
        e.exports = i
    }
    , {}],
    10: [function(t, e, n) {
        e.exports = {
            Model: t("./annotation.js"),
            View: t("./annotation_view.js")
        }
    }
    , {
        "./annotation.js": 8,
        "./annotation_view.js": 9
    }],
    11: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "emphasis",
            parent: "annotation",
            properties: {
                style: "string"
            }
        },
        (r.Prototype = function() {}
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        r.fragmentation = o.DONT_CARE,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8
    }],
    12: [function(t, e, n) {
        var i = t("../annotation").View
          , o = function(t) {
            i.call(this, t)
        };
        (o.Prototype = function() {
            this.setClasses = function() {
                i.prototype.setClasses.call(this),
                this.$el.addClass(this.node.style)
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../annotation": 10
    }],
    13: [function(t, e, n) {
        e.exports = {
            Model: t("./author_callout.js"),
            View: t("./author_callout_view.js")
        }
    }
    , {
        "./author_callout.js": 11,
        "./author_callout_view.js": 12
    }],
    14: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document")
          , o = i.Composite
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "box",
            parent: "content",
            properties: {
                source_id: "string",
                label: "string",
                children: ["array", "paragraph"]
            }
        },
        r.description = {
            name: "Box",
            remarks: ["A box type."],
            properties: {
                label: "string",
                children: "0..n Paragraph nodes"
            }
        },
        r.example = {
            id: "box_1",
            type: "box",
            label: "Box 1",
            children: ["paragraph_1", "paragraph_2"]
        },
        (r.Prototype = function() {
            this.getChildrenIds = function() {
                return this.properties.children
            }
        }
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171
    }],
    15: [function(t, e, n) {
        "use strict";
        var i = t("../node").View
          , o = t("../composite").View
          , r = t("../../../substance/application").$$
          , s = function(t, e) {
            o.call(this, t, e)
        };
        (s.Prototype = function() {
            this.render = function() {
                if (i.prototype.render.call(this),
                this.node.label) {
                    var t = r(".label", {
                        text: this.node.label
                    });
                    this.content.appendChild(t)
                }
                return this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
        }
        ).prototype = o.prototype,
        s.prototype = new s.Prototype,
        e.exports = s
    }
    , {
        "../../../substance/application": 158,
        "../composite": 31,
        "../node": 90
    }],
    16: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./box"),
            View: t("./box_view")
        }
    }
    , {
        "./box": 14,
        "./box_view": 15
    }],
    17: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "caption",
            parent: "content",
            properties: {
                source_id: "string",
                title: "paragraph",
                children: ["array", "paragraph"]
            }
        },
        o.description = {
            name: "Caption",
            remarks: ["Container element for the textual description that is associated with a Figure, Table, Video node etc.", "This is the title for the figure or the description of the figure that prints or displays with the figure."],
            properties: {
                title: "Caption title (optional)",
                children: "0..n Paragraph nodes"
            }
        },
        o.example = {
            id: "caption_1",
            children: ["paragraph_1", "paragraph_2"]
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                return this.properties.children || []
            }
            ,
            this.hasTitle = function() {
                return !!this.properties.title
            }
            ,
            this.getTitle = function() {
                if (this.properties.title)
                    return this.document.get(this.properties.title)
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    18: [function(t, e, n) {
        "use strict";
        var i = t("../composite").View
          , o = t("../../../substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                if (this.content = o("div.content"),
                this.node.getTitle()) {
                    var t = this.createChildView(this.node.title).render().el;
                    t.classList.add("caption-title"),
                    this.content.appendChild(t)
                }
                return this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../../../substance/application": 158,
        "../composite": 31
    }],
    19: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./caption"),
            View: t("./caption_view")
        }
    }
    , {
        "./caption": 17,
        "./caption_view": 18
    }],
    20: [function(t, e, n) {
        var i = t("underscore")
          , o = t("../../../substance/document")
          , r = function(t, e) {
            o.Node.call(this, t, e)
        };
        r.type = {
            id: "article_citation",
            parent: "content",
            properties: {
                source_id: "string",
                title: "string",
                label: "string",
                authors: ["array", "string"],
                doi: "string",
                source: "string",
                volume: "string",
                citation_type: "string",
                publisher_name: "string",
                publisher_location: "string",
                fpage: "string",
                lpage: "string",
                year: "string",
                comment: "string",
                citation_urls: ["array", "object"],
                source_formats: ["array", "object"]
            }
        },
        r.description = {
            name: "Citation",
            remarks: ["A journal citation.", "This element can be used to describe all kinds of citations."],
            properties: {
                title: "The article's title",
                label: "Optional label (could be a number for instance)",
                doi: "DOI reference",
                source: "Usually the journal name",
                volume: "Issue number",
                citation_type: "Citation Type",
                publisher_name: "Publisher Name",
                publisher_location: "Publisher Location",
                fpage: "First page",
                lpage: "Last page",
                year: "The year of publication",
                comment: "Author comment.",
                citation_urls: "A list of links for accessing the article on the web"
            }
        },
        r.example = {
            id: "article_nature08160",
            type: "article_citation",
            label: "5",
            title: "The genome of the blood fluke Schistosoma mansoni",
            authors: ["M Berriman", "BJ Haas", "PT LoVerde"],
            citation_type: "Journal Article",
            doi: "http://dx.doi.org/10.1038/nature08160",
            source: "Nature",
            volume: "460",
            fpage: "352",
            lpage: "8",
            year: "1984",
            comment: "This is a comment.",
            citation_urls: [{
                name: "PubMed",
                url: "https://www.ncbi.nlm.nih.gov/pubmed/19606141"
            }]
        },
        (r.Prototype = function() {
            this.urls = function() {
                return this.properties.citation_urls.length > 0 ? this.properties.citation_urls : [this.properties.doi]
            }
            ,
            this.getHeader = function() {
                return i.compact([this.properties.label, this.properties.citation_type || "Reference"]).join(" - ")
            }
        }
        ).prototype = o.Node.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        o.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        underscore: 183
    }],
    21: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../../substance/application").$$
          , r = t("../node").View
          , s = t("../../resource_view")
          , a = function(t, e, n) {
            r.apply(this, arguments),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.renderBody = function() {
                var t = document.createDocumentFragment()
                  , e = this.node
                  , n = this.createTextPropertyView([e.id, "title"], {
                    classes: "title"
                });
                t.appendChild(n.render().el),
                t.appendChild(o(".authors", {
                    html: e.authors.join(", ")
                }));
                var r = ""
                  , s = ""
                  , a = ""
                  , c = "";
                e.source && "" === e.volume ? s = e.source : e.source && e.volume && (s = [e.source, e.volume].join(", ")),
                e.fpage && e.lpage && (a = [e.fpage, e.lpage].join("-"));
                var l = [];
                if (e.publisher_name && e.publisher_location && (l.push(e.publisher_name),
                l.push(e.publisher_location)),
                e.year && l.push(e.year),
                c = l.join(", "),
                r = s,
                s && (a || c) && (r += ": "),
                a && c ? r += [a, c].join(", ") : (r += a,
                r += c),
                t.appendChild(o(".source", {
                    html: r
                })),
                e.comment) {
                    var u = this.createTextView({
                        path: [e.id, "comment"],
                        classes: "comment"
                    });
                    t.appendChild(u.render().el)
                }
                if (e.doi && t.appendChild(o(".doi", {
                    children: [o("b", {
                        text: "DOI: "
                    }), o("a", {
                        href: e.doi,
                        target: "_new",
                        text: e.doi
                    })]
                })),
                e.citation_urls.length > 0) {
                    var p = o(".citation-urls");
                    i.each(e.citation_urls, function(t) {
                        p.appendChild(o("a.url", {
                            href: t.url,
                            text: t.name,
                            target: "_blank"
                        }))
                    }),
                    t.appendChild(p)
                }
                this.content.appendChild(t)
            }
        }
        ).prototype = r.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../resource_view": 125,
        "../node": 90,
        underscore: 183
    }],
    22: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./citation"),
            View: t("./citation_view")
        }
    }
    , {
        "./citation": 20,
        "./citation_view": 21
    }],
    23: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = t("../resource_reference/resource_reference")
          , s = function(t, e) {
            r.call(this, t, e)
        };
        s.type = {
            id: "citation_reference",
            parent: "resource_reference",
            properties: {
                target: "citation"
            }
        },
        (s.Prototype = function() {}
        ).prototype = r.prototype,
        (s.prototype = new s.Prototype).constructor = s,
        s.fragmentation = o.NEVER,
        i.Node.defineProperties(s),
        e.exports = s
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8,
        "../resource_reference/resource_reference": 103
    }],
    24: [function(t, e, n) {
        e.exports = {
            Model: t("./citation_reference.js"),
            View: t("../resource_reference/resource_reference_view.js")
        }
    }
    , {
        "../resource_reference/resource_reference_view.js": 104,
        "./citation_reference.js": 23
    }],
    25: [function(t, e, n) {
        var i = t("../annotation/annotation")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "underline",
            parent: "annotation",
            properties: {}
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        o.fragmentation = i.DONT_CARE,
        e.exports = o
    }
    , {
        "../annotation/annotation": 8
    }],
    26: [function(t, e, n) {
        e.exports = {
            Model: t("./code.js"),
            View: t("../annotation/annotation_view.js")
        }
    }
    , {
        "../annotation/annotation_view.js": 9,
        "./code.js": 25
    }],
    27: [function(t, e, n) {
        "use strict";
        var i = t("../text").Model
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "codeblock",
            parent: "content",
            properties: {
                source_id: "string",
                content: "string"
            }
        },
        o.config = {
            zoomable: !0
        },
        o.description = {
            name: "Codeblock",
            remarks: ["Text in a codeblock is displayed in a fixed-width font, and it preserves both spaces and line breaks"],
            properties: {
                content: "Content"
            }
        },
        o.example = {
            type: "codeblock",
            id: "codeblock_1",
            content: 'var text = "Sun";\nvar op1 = null;\ntext = op2.apply(op1.apply(text));\nconsole.log(text);'
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        e.exports = o
    }
    , {
        "../text": 114
    }],
    28: [function(t, e, n) {
        "use strict";
        var i = t("../text/text_view")
          , o = function(t) {
            i.call(this, t)
        };
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../text/text_view": 117
    }],
    29: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./codeblock"),
            View: t("./codeblock_view")
        }
    }
    , {
        "./codeblock": 27,
        "./codeblock_view": 28
    }],
    30: [function(t, e, n) {
        "use strict";
        var i = t("../node").View
          , o = function(t, e) {
            i.call(this, t, e),
            this.childrenViews = []
        };
        (o.Prototype = function() {
            this.render = function() {
                return i.prototype.render.call(this),
                this.renderChildren(),
                this
            }
            ,
            this.renderChildren = function() {
                for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
                    var n = this.createChildView(t[e]).render().el;
                    this.content.appendChild(n)
                }
            }
            ,
            this.dispose = function() {
                i.prototype.dispose.call(this);
                for (var t = 0; t < this.childrenViews.length; t++)
                    this.childrenViews[t].dispose()
            }
            ,
            this.delete = function() {}
            ,
            this.getCharPosition = function() {
                return 0
            }
            ,
            this.getDOMPosition = function() {
                var t = this.$(".content")[0]
                  , e = document.createRange();
                return e.setStartBefore(t.childNodes[0]),
                e
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../node": 90
    }],
    31: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document");
        e.exports = {
            Model: i.Composite,
            View: t("./composite_view")
        }
    }
    , {
        "../../../substance/document": 171,
        "./composite_view": 30
    }],
    32: [function(t, e, n) {
        var i = t("underscore")
          , o = t("../../../substance/document")
          , r = function(t, e) {
            o.Node.call(this, t, e)
        };
        r.type = {
            id: "contributor",
            parent: "content",
            properties: {
                source_id: "string",
                name: "string",
                role: "string",
                contributor_type: "string",
                affiliations: ["array", "affiliation"],
                present_address: ["string"],
                fundings: ["array", "string"],
                image: "string",
                emails: ["array", "string"],
                contribution: "string",
                bio: ["array", "paragraph"],
                deceased: "boolean",
                members: ["array", "string"],
                orcid: "string",
                equal_contrib: ["array", "string"],
                competing_interests: ["array", "string"]
            }
        },
        r.description = {
            name: "Contributor",
            remarks: ["A contributor entity."],
            properties: {
                name: "Full name",
                affiliations: "A list of affiliation ids",
                present_address: "Present address of the contributor",
                role: "Role of contributor (e.g. Author, Editor)",
                fundings: "A list of funding descriptions",
                deceased: !1,
                emails: "A list of emails",
                orcid: "ORCID",
                contribution: "Description of contribution",
                equal_contrib: "A list of people who contributed equally",
                competing_interests: "A list of conflicts",
                members: "a list of group members"
            }
        },
        r.example = {
            id: "person_1",
            type: "contributor",
            name: "John Doe",
            affiliations: ["affiliation_1", "affiliation_2"],
            role: "Author",
            fundings: ["Funding Organisation 1"],
            emails: ["a@b.com"],
            contribution: "Revising the article, data cleanup",
            equal_contrib: ["John Doe", "Jane Doe"]
        },
        (r.Prototype = function() {
            this.getAffiliations = function() {
                return i.map(this.properties.affiliations, function(t) {
                    return this.document.get(t)
                }, this)
            }
            ,
            this.getHeader = function() {
                return this.properties.contributor_type || "Author"
            }
        }
        ).prototype = o.Node.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        o.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        underscore: 183
    }],
    33: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../node").View
          , r = t("../../../substance/application").$$
          , s = t("../../resource_view")
          , a = function(t, e, n) {
            o.call(this, t, e),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.renderBody = function() {
                if (this.content.appendChild(r(".contributor-name", {
                    text: this.node.name
                })),
                this.node.role && this.content.appendChild(r(".role", {
                    text: this.node.role
                })),
                this.content.appendChild(r(".affiliations", {
                    children: i.map(this.node.getAffiliations(), function(t) {
                        var e = i.compact([t.department, t.institution, t.city, t.country]).join(" ");
                        return r(".affiliation", {
                            text: e
                        })
                    })
                })),
                this.node.present_address && this.content.appendChild(r(".present-address.contrib-data", {
                    children: [r("span.contrib-label", {
                        text: "Present address: "
                    }), r("span", {
                        text: this.node.present_address
                    })]
                })),
                this.node.contribution && this.content.appendChild(r(".contribution.contrib-data", {
                    children: [r("span.contrib-label", {
                        text: "Contribution: "
                    }), r("span", {
                        text: this.node.contribution
                    })]
                })),
                this.node.equal_contrib && this.node.equal_contrib.length > 0 && this.content.appendChild(r(".equal-contribution.contrib-data", {
                    children: [r("span.contrib-label", {
                        text: "Contributed equally with: "
                    }), r("span", {
                        text: this.node.equal_contrib.join(", ")
                    })]
                })),
                this.node.emails.length > 0 && this.content.appendChild(r(".emails.contrib-data", {
                    children: [r("span.contrib-label", {
                        text: "Por correspondencia: "
                    }), r("span", {
                        children: i.map(this.node.emails, function(t) {
                            return r("a", {
                                href: "mailto:" + t,
                                text: t + " "
                            })
                        })
                    })]
                })),
                this.node.fundings.length > 0 && this.content.appendChild(r(".fundings.contrib-data", {
                    children: [r("span.contrib-label", {
                        text: "Funding: "
                    }), r("span", {
                        text: this.node.fundings.join("; ")
                    })]
                })),
                this.node.competing_interests.length && this.content.appendChild(r(".competing-interests.contrib-data", {
                    children: [r("span.contrib-label", {
                        text: "Competing Interests: "
                    }), r("span", {
                        text: this.node.competing_interests.join(", ")
                    })]
                })),
                this.node.orcid && this.content.appendChild(r(".contrib-data", {
                    children: [r("span.contrib-label", {
                        text: "ORCID: "
                    }), r("a.orcid", {
                        html: '<a href="https://orcid.org/' + this.node.orcid + '">https://orcid.org/' + this.node.orcid + '</a>'
                    }/*{href:this.node.orcid,text:this.node.orcid}*/
                    )]
                })),
                this.node.members.length > 0 && this.content.appendChild(r(".group-members.contrib-data", {
                    children: [r("span.contrib-label", {
                        text: "Group Members: "
                    }), r("span", {
                        text: this.node.members.join(", ")
                    })]
                })),
                this.node.image || this.node.bio && this.node.bio.length > 0) {
                    var t = r(".bio")
                      , e = [r("img", {
                        src: this.node.image
                    }), t];
                    i.each(this.node.bio, function(e) {
                        t.appendChild(this.createView(e).render().el)
                    }, this),
                    this.content.appendChild(r(".contributor-bio.container", {
                        children: e
                    }))
                }
                this.node.deceased && this.content.appendChild(r(".label", {
                    text: "* Deceased"
                }))
            }
        }
        ).prototype = o.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../resource_view": 125,
        "../node": 90,
        underscore: 183
    }],
    34: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./contributor"),
            View: t("./contributor_view")
        }
    }
    , {
        "./contributor": 32,
        "./contributor_view": 33
    }],
    35: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = t("../resource_reference/resource_reference")
          , s = function(t, e) {
            r.call(this, t, e)
        };
        s.type = {
            id: "contributor_reference",
            parent: "resource_reference",
            properties: {
                target: "contributor"
            }
        },
        (s.Prototype = function() {}
        ).prototype = r.prototype,
        (s.prototype = new s.Prototype).constructor = s,
        s.fragmentation = o.NEVER,
        i.Node.defineProperties(s),
        e.exports = s
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8,
        "../resource_reference/resource_reference": 103
    }],
    36: [function(t, e, n) {
        e.exports = {
            Model: t("./contributor_reference.js"),
            View: t("../resource_reference/resource_reference_view.js")
        }
    }
    , {
        "../resource_reference/resource_reference_view.js": 104,
        "./contributor_reference.js": 35
    }],
    37: [function(t, e, n) {
        var i = t("underscore")
          , o = t("../../../substance/document")
          , r = function(t, e) {
            o.Node.call(this, t, e)
        };
        r.type = {
            id: "cover",
            parent: "content",
            properties: {
                source_id: "string",
                authors: ["array", "paragraph"],
                breadcrumbs: "object"
            }
        },
        r.description = {
            name: "Cover",
            remarks: ["Virtual view on the title and authors of the paper."],
            properties: {
                authors: "A paragraph that has the authors names plus references to the person cards"
            }
        },
        r.example = {
            id: "cover",
            type: "cover"
        },
        (r.Prototype = function() {
            this.getAuthors = function() {
                return i.map(this.properties.authors, function(t) {
                    return this.document.get(t)
                }, this)
            }
            ,
            this.getTitle = function() {
                return this.document.title
            }
        }
        ).prototype = o.Node.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        o.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        underscore: 183
    }],
    38: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../node").View
          , r = t("../../../substance/application").$$
          , s = t("../../article_util")
          , a = function(t, e) {
            o.call(this, t, e)
        };
        (a.Prototype = function() {
            this.render = function() {
                o.prototype.render.call(this);
                var t = this.node
                  , e = this.node.document.get("publication_info");
                if (e) {
                    var n, a = e.subjects;
                    if (a)
                        n = e.subject_link ? r(".subjects", {
                            children: i.map(e.getSubjectLinks(), function(t) {
                                return r("a", {
                                    href: t.url,
                                    text: t.name
                                })
                            })
                        }) : r(".subjects", {
                            html: a.join(" ")
                        }),
                        this.content.appendChild(n)
                }
                var c = this.createTextPropertyView(["document", "title"], {
                    classes: "title",
                    elementType: "div"
                });
                this.content.appendChild(c.render().el);
                var l = r(".authors", {
                    children: i.map(t.getAuthors(), function(t) {
                        var e = this.viewFactory.createView(t).render().el;
                        return this.content.appendChild(e),
                        e
                    }, this)
                });
                if (l.appendChild(r(".content-node.text.plain", {
                    children: [r(".content", {
                        text: this.node.document.on_behalf_of
                    })]
                })),
                this.content.appendChild(l),
                e) {
                    var u = e.published_on
                      , p = e.article_type;
                    if (u) {
                        var h = [s.formatDate(u)];
                        if (p)
                            if (e.article_type_link) {
                                var d = e.getArticleTypeLink();
                                h.unshift('<a href="' + d.url + '">' + d.name + "</a>")
                            } else
                                h.unshift(p);
                        this.content.appendChild(r(".published-on", {
                            html: h.join(" ")
                        }))
                    }
                }
                if (e && e.links.length > 0) {
                    var f = r(".links");
                    i.each(e.links, function(t) {
                        if ("json" === t.type && "" === t.url) {
                            var e = JSON.stringify(this.node.document.toJSON(), null, "  ")
                              , n = new Blob([e],{
                                type: "application/json"
                            });
                            f.appendChild(r("a.json", {
                                href: window.URL ? window.URL.createObjectURL(n) : "#",
                                html: '<i class="fa fa-external-link-square"></i> ' + t.name,
                                target: "_blank"
                            }))
                        } else
                            f.appendChild(r("a." + t.type, {
                                href: t.url,
                                html: '<i class="fa fa-external-link-square"></i> ' + t.name,
                                target: "_blank"
                            }))
                    }, this),
                    this.content.appendChild(f)
                }
                if (e) {
                    var g = e.doi;
                    g && this.content.appendChild(r(".doi", {
                        html: 'DOI: <a href="http://dx.doi.org/' + g + '">' + g + "</a>"
                    }))
                }
                return this
            }
        }
        ).prototype = o.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../article_util": 4,
        "../node": 90,
        underscore: 183
    }],
    39: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./cover"),
            View: t("./cover_view")
        }
    }
    , {
        "./cover": 37,
        "./cover_view": 38
    }],
    40: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "cross_reference",
            parent: "annotation",
            properties: {
                target: "node"
            }
        },
        (r.Prototype = function() {}
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        r.fragmentation = o.NEVER,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8
    }],
    41: [function(t, e, n) {
        "use strict";
        var i = t("../annotation/annotation_view")
          , o = function(t, e) {
            i.call(this, t, e),
            this.$el.addClass("cross-reference")
        };
        (o.Prototype = function() {
            this.createElement = function() {
                var t = document.createElement("a");
                return t.setAttribute("href", ""),
                t
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../annotation/annotation_view": 9
    }],
    42: [function(t, e, n) {
        e.exports = {
            Model: t("./cross_reference.js"),
            View: t("./cross_reference_view.js")
        }
    }
    , {
        "./cross_reference.js": 40,
        "./cross_reference_view.js": 41
    }],
    43: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "custom_annotation",
            parent: "annotation",
            properties: {
                name: "string"
            }
        },
        (r.Prototype = function() {}
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        r.fragmentation = o.DONT_CARE,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8
    }],
    44: [function(t, e, n) {
        var i = t("../annotation").View
          , o = function(t) {
            i.call(this, t)
        };
        (o.Prototype = function() {
            this.setClasses = function() {
                i.prototype.setClasses.call(this),
                this.$el.removeClass("custom_annotation").addClass(this.node.name)
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../annotation": 10
    }],
    45: [function(t, e, n) {
        e.exports = {
            Model: t("./custom_annotation.js"),
            View: t("./custom_annotation_view.js")
        }
    }
    , {
        "./custom_annotation.js": 43,
        "./custom_annotation_view.js": 44
    }],
    46: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = function(t) {
            i.Node.call(this, t)
        };
        o.type = {
            id: "definition",
            parent: "content",
            properties: {
                source_id: "string",
                title: "string",
                description: "string"
            }
        },
        o.description = {
            name: "Definition",
            remarks: ["A journal citation.", "This element can be used to describe all kinds of citations."],
            properties: {
                title: "The article's title",
                description: "Definition description"
            }
        },
        o.example = {
            id: "definition_def1",
            type: "Definition",
            title: "IAP",
            description: "Integrated Analysis Platform"
        },
        (o.Prototype = function() {
            this.urls = function() {
                return this.properties.citation_urls.length > 0 ? this.properties.citation_urls : [this.properties.doi]
            }
            ,
            this.getHeader = function() {
                return this.properties.label ? [this.properties.label, this.properties.title].join(". ") : this.properties.title
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    47: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../node").View
          , r = t("../../../substance/application").$$
          , s = t("../../resource_view")
          , a = function(t, e, n) {
            o.call(this, t, e),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.renderBody = function() {
                this.content.appendChild(r(".description", {
                    text: this.node.description
                }))
            }
        }
        ).prototype = o.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../resource_view": 125,
        "../node": 90,
        underscore: 183
    }],
    48: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./definition"),
            View: t("./definition_view")
        }
    }
    , {
        "./definition": 46,
        "./definition_view": 47
    }],
    49: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = t("../resource_reference/resource_reference")
          , s = function(t, e) {
            r.call(this, t, e)
        };
        s.type = {
            id: "definition_reference",
            parent: "resource_reference",
            properties: {
                target: "definition"
            }
        },
        (s.Prototype = function() {}
        ).prototype = r.prototype,
        (s.prototype = new s.Prototype).constructor = s,
        s.fragmentation = o.NEVER,
        i.Node.defineProperties(s),
        e.exports = s
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8,
        "../resource_reference/resource_reference": 103
    }],
    50: [function(t, e, n) {
        e.exports = {
            Model: t("./definition_reference.js"),
            View: t("../resource_reference/resource_reference_view.js")
        }
    }
    , {
        "../resource_reference/resource_reference_view.js": 104,
        "./definition_reference.js": 49
    }],
    51: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Node.call(this, t, e)
        };
        o.type = {
            id: "document",
            parent: "content",
            properties: {
                views: ["array", "view"],
                guid: "string",
                creator: "string",
                title: "string",
                authors: ["array", "contributor"],
                on_behalf_of: "string",
                abstract: "string"
            }
        },
        (o.Prototype = function() {}
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    52: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./document_node")
        }
    }
    , {
        "./document_node": 51
    }],
    53: [function(t, e, n) {
        var i = t("../annotation/annotation")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "emphasis",
            parent: "annotation",
            properties: {}
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        o.fragmentation = i.DONT_CARE,
        e.exports = o
    }
    , {
        "../annotation/annotation": 8
    }],
    54: [function(t, e, n) {
        e.exports = {
            Model: t("./emphasis.js"),
            View: t("../annotation/annotation_view.js")
        }
    }
    , {
        "../annotation/annotation_view.js": 9,
        "./emphasis.js": 53
    }],
    55: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            parent: "content",
            properties: {
                source_id: "string",
                label: "string",
                url: "string",
                caption: "caption",
                position: "string",
                attrib: "string"
            }
        },
        o.config = {
            zoomable: !0
        },
        o.description = {
            name: "Figure",
            remarks: ["A figure is a figure is figure."],
            properties: {
                label: "Label used as header for the figure cards",
                url: "Image url",
                caption: "A reference to a caption node that describes the figure",
                attrib: "Figure attribution"
            }
        },
        o.example = {
            id: "figure_1",
            label: "Figure 1",
            url: "http://example.com/fig1.png",
            caption: "caption_1"
        },
        (o.Prototype = function() {
            this.hasCaption = function() {
                return !!this.properties.caption
            }
            ,
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.caption && t.push(this.properties.caption),
                t
            }
            ,
            this.getCaption = function() {
                if (this.properties.caption)
                    return this.document.get(this.properties.caption)
            }
            ,
            this.getHeader = function() {
                return this.properties.label
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o.prototype, Object.keys(o.type.properties)),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    56: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../composite").View
          , r = t("../../../substance/application").$$
          , s = t("../../resource_view")
          , a = function(t, e, n) {
            o.call(this, t, e),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.isZoomable = !0,
            this.renderBody = function() {
                if (this.content.appendChild(r(".label", {
                    text: this.node.label
                })),
                this.node.url) {
                    var t = r(".image-wrapper", {
                        children: [r("a", {
                            href: this.node.url,
                            target: "_blank",
                            children: [r("img", {
                                src: this.node.url
                            })]
                        })]
                    });
                    this.content.appendChild(t)
                }
                this.renderChildren(),
                this.node.attrib && this.content.appendChild(r(".figure-attribution", {
                    text: this.node.attrib
                }))
            }
            ,
            this.renderLabel = function() {
                var t = r(".name", {
                    href: "#"
                });
                return this.renderAnnotatedText([this.node.id, "label"], t),
                t
            }
        }
        ).prototype = o.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../resource_view": 125,
        "../composite": 31,
        underscore: 183
    }],
    57: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./figure"),
            View: t("./figure_view")
        }
    }
    , {
        "./figure": 55,
        "./figure_view": 56
    }],
    58: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = t("../resource_reference/resource_reference")
          , s = function(t, e) {
            r.call(this, t, e)
        };
        s.type = {
            id: "figure_reference",
            parent: "resource_reference",
            properties: {
                target: "figure"
            }
        },
        (s.Prototype = function() {}
        ).prototype = r.prototype,
        (s.prototype = new s.Prototype).constructor = s,
        s.fragmentation = o.NEVER,
        i.Node.defineProperties(s),
        e.exports = s
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8,
        "../resource_reference/resource_reference": 103
    }],
    59: [function(t, e, n) {
        e.exports = {
            Model: t("./figure_reference.js"),
            View: t("../resource_reference/resource_reference_view.js")
        }
    }
    , {
        "../resource_reference/resource_reference_view.js": 104,
        "./figure_reference.js": 58
    }],
    60: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document")
          , o = i.Node
          , r = t("../paragraph").Model
          , s = i.Composite
          , a = function(t, e) {
            s.call(this, t, e)
        };
        a.type = {
            id: "footnote",
            parent: "paragraph",
            properties: {
                footnoteType: "string",
                specificUse: "string",
                label: "string",
                children: ["array", "string"]
            }
        },
        a.example = {
            type: "footnote",
            id: "footnote_1",
            label: "a",
            "children ": ["text_1", "image_1", "text_2"]
        },
        (a.Prototype = function() {}
        ).prototype = r.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        o.defineProperties(a.prototype, ["children", "label", "footnoteType", "specificUse"]),
        e.exports = a
    }
    , {
        "../../../substance/document": 171,
        "../paragraph": 93
    }],
    61: [function(t, e, n) {
        "use strict";
        var i = t("../composite/composite_view")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../composite/composite_view": 30
    }],
    62: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./footnote"),
            View: t("./footnote_view")
        }
    }
    , {
        "./footnote": 60,
        "./footnote_view": 61
    }],
    63: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = t("../resource_reference/resource_reference")
          , s = function(t, e) {
            r.call(this, t, e)
        };
        s.type = {
            id: "footnote_reference",
            parent: "resource_reference",
            properties: {
                target: "footnote"
            }
        },
        (s.Prototype = function() {}
        ).prototype = r.prototype,
        (s.prototype = new s.Prototype).constructor = s,
        s.fragmentation = o.NEVER,
        i.Node.defineProperties(s),
        e.exports = s
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8,
        "../resource_reference/resource_reference": 103
    }],
    64: [function(t, e, n) {
        "use strict";
        var i = t("../annotation/annotation_view")
          , o = t("../../../substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e),
            this.$el.addClass("footnote-reference"),
            this._expanded = !1
        };
        (r.Prototype = function() {
            this.render = function() {
                var t = this._getFootnote();
                this.el.innerHTML = "",
                this.toggleEl = o("a", {
                    href: "#",
                    html: t.properties.label
                }),
                $(this.toggleEl).on("click", this._onToggle.bind(this)),
                this.$el.append(this.toggleEl),
                this.footnoteView = this._createView(t).render(),
                this.footnoteView.$el.addClass("footnote"),
                this.node.properties.generated && this.$el.addClass("sm-generated"),
                this.$el.append(this.footnoteView.el)
            }
            ,
            this._onToggle = function(t) {
                t.preventDefault(),
                this.$el.toggleClass("sm-expanded")
            }
            ,
            this._createView = function(t) {
                return this.viewFactory.createView(t)
            }
            ,
            this._getFootnote = function() {
                return this.node.document.get(this.node.target)
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../../../substance/application": 158,
        "../annotation/annotation_view": 9
    }],
    65: [function(t, e, n) {
        e.exports = {
            Model: t("./footnote_reference.js"),
            View: t("./footnote_reference_view.js")
        }
    }
    , {
        "./footnote_reference.js": 63,
        "./footnote_reference_view.js": 64
    }],
    66: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = function(t) {
            i.Node.call(this, t)
        };
        o.type = {
            id: "formula",
            parent: "content",
            properties: {
                source_id: "string",
                inline: "boolean",
                label: "string",
                format: ["array", "string"],
                data: ["array", "string"]
            }
        },
        o.description = {
            name: "Formula",
            remarks: ["Can either be expressed in MathML format or using an image url"],
            properties: {
                label: "Formula label (4)",
                data: "Formula data, either MathML or image url",
                format: "Can either be `mathml` or `image`"
            }
        },
        o.example = {
            type: "formula",
            id: "formula_eqn1",
            label: "(1)",
            content: "<mml:mrow>...</mml:mrow>",
            format: "mathml"
        },
        (o.Prototype = function() {
            this.inline = !1
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constuctor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    67: [function(t, e, n) {
        "use strict";
        var i = t("../node").View
          , o = function(t, e) {
            i.call(this, t, e)
        };
        (o.Prototype = function() {
            var t = {
                latex: "math/tex",
                mathml: "math/mml"
            }
              , e = {
                image: 0,
                mathml: 1,
                latex: 2
            };
            this.render = function() {
                this.node.inline && this.$el.addClass("inline");
                var n, i = [];
                for (n = 0; n < this.node.data.length; n++)
                    i.push({
                        format: this.node.format[n],
                        data: this.node.data[n]
                    });
                if (i.sort(function(t, n) {
                    return e[t.format] - e[n.format]
                }),
                i.length > 0) {
                    var o = !1
                      , r = !1;
                    for (n = 0; n < i.length; n++) {
                        var s = i[n].format
                          , a = i[n].data;
                        switch (s) {
                        case "mathml":
                            r || (this.$el.append($(a)),
                            r = !0,
                            o && (this.$preview.hide(),
                            o = !0));
                            break;
                        case "latex":
                            if (!r) {
                                var c = t[s];
                                this.node.inline || (c += "; mode=display");
                                var l = $("<script>").attr("type", c).html(a);
                                this.$el.append(l),
                                r = !0
                            }
                            break;
                        case "image":
                            if (!o) {
                                var u = $("<div>").addClass("MathJax_Preview");
                                u.append($("<img>").attr("src", a)),
                                this.$el.append(u),
                                this.$preview = u,
                                o = !0
                            }
                            break;
                        default:
                            console.error("Unknown formula format:", s)
                        }
                    }
                }
                return this.node.label && this.$el.append($('<div class="label">').html(this.node.label)),
                this
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../node": 90
    }],
    68: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./formula"),
            View: t("./formula_view")
        }
    }
    , {
        "./formula": 66,
        "./formula_view": 67
    }],
    69: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document").Node
          , o = t("../text/text_node")
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "heading",
            parent: "content",
            properties: {
                source_id: "string",
                content: "string",
                label: "string",
                level: "number"
            }
        },
        r.example = {
            type: "heading",
            id: "heading_1",
            content: "Introduction",
            level: 1
        },
        r.description = {
            name: "Heading",
            remarks: ["Denotes a section or sub section in your article."],
            properties: {
                content: "Heading title",
                label: "Heading label",
                level: "Heading level. Ranges from 1..4"
            }
        },
        (r.Prototype = function() {
            this.splitInto = "paragraph",
            this.includeInToc = function() {
                return !0
            }
            ,
            this.getLevel = function() {
                return this.level
            }
        }
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        i.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        "../text/text_node": 115
    }],
    70: [function(t, e, n) {
        "use strict";
        var i = t("../node").View
          , o = t("../../../substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e),
            this.$el.addClass("level-" + this.node.level)
        };
        (r.Prototype = function() {
            this.render = function() {
                i.prototype.render.call(this);
                var t = this.createTextPropertyView([this.node.id, "content"], {
                    classes: "title"
                });
                if (this.node.label) {
                    var e = o(".label", {
                        text: this.node.label
                    });
                    this.content.appendChild(e)
                }
                return this.content.appendChild(t.render().el),
                this
            }
            ,
            this.renderTocItem = function() {
                var t = o("div");
                if (this.node.label) {
                    var e = o(".label", {
                        text: this.node.label
                    });
                    t.appendChild(e)
                }
                var n = o("span");
                return this.renderAnnotatedText([this.node.id, "content"], n),
                t.appendChild(n),
                t
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../../../substance/application": 158,
        "../node": 90
    }],
    71: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./heading"),
            View: t("./heading_view")
        }
    }
    , {
        "./heading": 69,
        "./heading_view": 70
    }],
    72: [function(t, e, n) {
        t("underscore");
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Node.call(this, t, e)
        };
        o.type = {
            id: "html_table",
            parent: "content",
            properties: {
                source_id: "string",
                label: "string",
                content: "string",
                footers: ["array", "string"],
                caption: "caption"
            }
        },
        o.config = {
            zoomable: !0
        },
        o.description = {
            name: "HTMLTable",
            remarks: ["A table figure which is expressed in HTML notation"],
            properties: {
                source_id: "string",
                label: "Label shown in the resource header.",
                title: "Full table title",
                content: "HTML data",
                footers: "HTMLTable footers expressed as an array strings",
                caption: "References a caption node, that has all the content"
            }
        },
        o.example = {
            id: "html_table_1",
            type: "html_table",
            label: "HTMLTable 1.",
            title: "Lorem ipsum table",
            content: "<table>...</table>",
            footers: [],
            caption: "caption_1"
        },
        (o.Prototype = function() {
            this.getCaption = function() {
                if (this.properties.caption)
                    return this.document.get(this.properties.caption)
            }
            ,
            this.getHeader = function() {
                return this.properties.label
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171,
        underscore: 183
    }],
    73: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../node").View
          , r = t("../../../substance/application").$$
          , s = t("../../resource_view")
          , a = function(t, e, n) {
            o.call(this, t, e),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.isZoomable = !0,
            this.renderBody = function() {
                var t = r(".table-wrapper", {
                    html: this.node.content
                });
                this.content.appendChild(t);
                var e = r(".footers", {
                    children: i.map(this.node.footers, function(t) {
                        return r(".footer", {
                            html: "<b>" + t.label + "</b> " + t.content
                        })
                    })
                });
                if (this.node.caption) {
                    var n = this.createView(this.node.caption);
                    this.content.appendChild(n.render().el)
                }
                this.content.appendChild(e)
            }
        }
        ).prototype = o.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../resource_view": 125,
        "../node": 90,
        underscore: 183
    }],
    74: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./html_table"),
            View: t("./html_table_view")
        }
    }
    , {
        "./html_table": 72,
        "./html_table_view": 73
    }],
    75: [function(t, e, n) {
        "use strict";
        t("../../../substance/document").Node;
        var i = t("../web_resource").Model
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "image",
            parent: "webresource",
            properties: {
                source_id: "string"
            }
        },
        o.example = {
            type: "image",
            id: "image_1",
            url: "http://substance.io/image_1.png"
        },
        o.description = {
            name: "Image",
            remarks: ["Represents a web-resource for an image."],
            properties: {}
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        e.exports = o
    }
    , {
        "../../../substance/document": 171,
        "../web_resource": 123
    }],
    76: [function(t, e, n) {
        "use strict";
        var i = t("../node").View
          , o = function(t, e) {
            i.call(this, t, e)
        };
        (o.Prototype = function() {
            var t = Array.prototype.indexOf;
            this.render = function() {
                var e = document.createElement("div");
                e.className = "content";
                var n = document.createElement("div");
                n.className = "image-char",
                this._imgChar = n;
                var i = document.createElement("img");
                return i.src = this.node.url,
                i.alt = "alt text",
                i.title = "alt text",
                n.appendChild(i),
                e.appendChild(n),
                this.el.appendChild(e),
                this._imgPos = t.call(n.childNodes, i),
                this
            }
            ,
            this.delete = function(t, e) {
                for (var n = this.$(".content")[0], i = n.childNodes, o = e - 1; o >= 0; o--)
                    n.removeChild(i[t + o])
            }
            ,
            this.getCharPosition = function(t, e) {
                if (t === this._imgChar)
                    return e > this._imgPos ? 1 : 0;
                console.log("Errhhh..")
            }
            ,
            this.getDOMPosition = function(t) {
                var e = this.$(".content")[0]
                  , n = document.createRange();
                return 0 === t ? n.setStartBefore(e.childNodes[0]) : n.setStartAfter(e.childNodes[0]),
                n
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../node": 90
    }],
    77: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./image"),
            View: t("./image_view")
        }
    }
    , {
        "./image": 75,
        "./image_view": 76
    }],
    78: [function(t, e, n) {
        "use strict";
        e.exports = {
            node: t("./node"),
            composite: t("./composite"),
            annotation: t("./annotation"),
            emphasis: t("./emphasis"),
            strong: t("./strong"),
            subscript: t("./subscript"),
            superscript: t("./superscript"),
            underline: t("./underline"),
            code: t("./code"),
            author_callout: t("./author_callout"),
            custom_annotation: t("./custom_annotation"),
            "inline-formula": t("./inline_formula"),
            resource_reference: t("./resource_reference"),
            contributor_reference: t("./contributor_reference"),
            figure_reference: t("./figure_reference"),
            citation_reference: t("./citation_reference"),
            definition_reference: t("./definition_reference"),
            cross_reference: t("./cross_reference"),
            footnote_reference: t("./footnote_reference"),
            publication_info: t("./publication_info"),
            link: t("./link"),
            inline_image: t("./inline_image"),
            document: t("./document"),
            text: t("./text"),
            paragraph: t("./paragraph"),
            heading: t("./heading"),
            box: t("./box"),
            cover: t("./cover"),
            figure: t("./figure"),
            caption: t("./caption"),
            image: t("./image"),
            webresource: t("./web_resource"),
            html_table: t("./html_table"),
            supplement: t("./supplement"),
            video: t("./video"),
            contributor: t("./contributor"),
            definition: t("./definition"),
            citation: t("./citation"),
            formula: t("./formula"),
            list: t("./list"),
            codeblock: t("./codeblock"),
            affiliation: t("./_affiliation"),
            footnote: t("./footnote"),
            quote: t("./quote")
        }
    }
    , {
        "./_affiliation": 7,
        "./annotation": 10,
        "./author_callout": 13,
        "./box": 16,
        "./caption": 19,
        "./citation": 22,
        "./citation_reference": 24,
        "./code": 26,
        "./codeblock": 29,
        "./composite": 31,
        "./contributor": 34,
        "./contributor_reference": 36,
        "./cover": 39,
        "./cross_reference": 42,
        "./custom_annotation": 45,
        "./definition": 48,
        "./definition_reference": 50,
        "./document": 52,
        "./emphasis": 54,
        "./figure": 57,
        "./figure_reference": 59,
        "./footnote": 62,
        "./footnote_reference": 65,
        "./formula": 68,
        "./heading": 71,
        "./html_table": 74,
        "./image": 77,
        "./inline_formula": 79,
        "./inline_image": 82,
        "./link": 84,
        "./list": 87,
        "./node": 90,
        "./paragraph": 93,
        "./publication_info": 96,
        "./quote": 99,
        "./resource_reference": 102,
        "./strong": 105,
        "./subscript": 107,
        "./superscript": 109,
        "./supplement": 111,
        "./text": 114,
        "./underline": 118,
        "./video": 120,
        "./web_resource": 123
    }],
    79: [function(t, e, n) {
        e.exports = {
            Model: t("./inline_formula.js"),
            View: t("./inline_formula_view.js")
        }
    }
    , {
        "./inline_formula.js": 80,
        "./inline_formula_view.js": 81
    }],
    80: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "inline-formula",
            parent: "annotation",
            properties: {
                target: "formula"
            }
        },
        (r.Prototype = function() {}
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        r.fragmentation = o.NEVER,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8
    }],
    81: [function(t, e, n) {
        "use strict";
        var i = t("../resource_reference").View
          , o = function(t, e) {
            i.call(this, t, e),
            $(this.el).removeClass("resource-reference")
        };
        (o.Prototype = function() {
            this.createElement = function() {
                return document.createElement("span")
            }
            ,
            this.render = function() {
                var t = this.node.document.get(this.node.target)
                  , e = this.viewFactory.createView(t);
                return this.el.innerHTML = e.render().el.innerHTML,
                this
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../resource_reference": 102
    }],
    82: [function(t, e, n) {
        e.exports = {
            Model: t("./inline_image.js"),
            View: t("../annotation/annotation_view.js")
        }
    }
    , {
        "../annotation/annotation_view.js": 9,
        "./inline_image.js": 83
    }],
    83: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "inline-image",
            parent: "annotation",
            properties: {
                target: "image"
            }
        },
        (r.Prototype = function() {}
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        r.fragmentation = o.NEVER,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8
    }],
    84: [function(t, e, n) {
        e.exports = {
            Model: t("./link.js"),
            View: t("./link_view.js")
        }
    }
    , {
        "./link.js": 85,
        "./link_view.js": 86
    }],
    85: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "link",
            parent: "annotation",
            properties: {
                url: "string"
            }
        },
        (r.Prototype = function() {}
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        r.fragmentation = o.NEVER,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8
    }],
    86: [function(t, e, n) {
        var i = t("../annotation").View
          , o = function(t) {
            i.call(this, t)
        };
        (o.Prototype = function() {
            this.createElement = function() {
                var t = document.createElement("a");
                return t.setAttribute("href", this.node.url),
                t
            }
            ,
            this.setClasses = function() {
                this.$el.addClass("link")
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../annotation": 10
    }],
    87: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./list"),
            View: t("./list_view")
        }
    }
    , {
        "./list": 88,
        "./list_view": 89
    }],
    88: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../../substance/document")
          , r = o.Node
          , s = o.Composite
          , a = function(t, e) {
            s.call(this, t, e)
        };
        a.type = {
            id: "list",
            parent: "content",
            properties: {
                source_id: "string",
                items: ["array", "paragraph"],
                ordered: "boolean"
            }
        },
        a.description = {
            name: "List",
            remarks: ["Lists can either be numbered or bullet lists"],
            properties: {
                ordered: "Specifies wheter the list is ordered or not",
                items: "An array of paragraph references"
            }
        },
        a.example = {
            type: "list",
            id: "list_1",
            "items ": ["paragraph_listitem_1", "paragraph_listitem_2"]
        },
        (a.Prototype = function() {
            this.getLength = function() {
                return this.properties.items.length
            }
            ,
            this.getChildrenIds = function() {
                return i.clone(this.items)
            }
            ,
            this.getItems = function() {
                return i.map(this.properties.items, function(t) {
                    return this.document.get(t)
                }, this)
            }
            ,
            this.getChangePosition = function(t) {
                if ("items" === t.path[1])
                    if ("update" === t.type) {
                        var e = t.diff;
                        if (e.isInsert())
                            return t.diff.pos + 1;
                        if (e.isDelete())
                            return t.diff.pos;
                        if (e.isMove())
                            return t.diff.target
                    } else if ("set" === t.type)
                        return this.properties.items.length - 1;
                return -1
            }
            ,
            this.isMutable = function() {
                return !0
            }
            ,
            this.insertChild = function(t, e, n) {
                t.update([this.id, "items"], ["+", e, n])
            }
            ,
            this.deleteChild = function(t, e) {
                var n = this.items.indexOf(e);
                t.update([this.id, "items"], ["-", n, e]),
                t.delete(e)
            }
            ,
            this.canJoin = function(t) {
                return "list" === t.type
            }
            ,
            this.isBreakable = function() {
                return !0
            }
            ,
            this.break = function(t, e, n) {
                var i = this.properties.items.indexOf(e);
                if (i < 0)
                    throw new Error("Unknown child " + e);
                var o = t.get(e).break(t, n);
                return t.update([this.id, "items"], ["+", i + 1, o.id]),
                o
            }
        }
        ).prototype = s.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        r.defineProperties(a.prototype, ["items", "ordered"]),
        e.exports = a
    }
    , {
        "../../../substance/document": 171,
        underscore: 183
    }],
    89: [function(t, e, n) {
        "use strict";
        var i = t("../composite/composite_view")
          , o = t("./list")
          , r = function(t, e) {
            i.call(this, t, e)
        };
        r.whoami = "SubstanceListView",
        (r.Prototype = function() {
            this.render = function() {
                this.el.innerHTML = "";
                var t, e = this.node.ordered ? "OL" : "UL";
                for (this.content = document.createElement(e),
                this.content.classList.add("content"),
                t = 0; t < this.childrenViews.length; t++)
                    this.childrenViews[t].dispose();
                var n = this.node.getNodes();
                for (t = 0; t < n.length; t++) {
                    var i, r = this.node.document.get(n[t]), s = this.viewFactory.createView(r);
                    r instanceof o ? i = s.render().el : (i = document.createElement("LI")).appendChild(s.render().el),
                    this.content.appendChild(i),
                    this.childrenViews.push(s)
                }
                return this.el.appendChild(this.content),
                this
            }
            ,
            this.onNodeUpdate = function(t) {
                t.path[0] === this.node.id && "items" === t.path[1] && this.render()
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../composite/composite_view": 30,
        "./list": 88
    }],
    90: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./node"),
            View: t("./node_view")
        }
    }
    , {
        "./node": 91,
        "./node_view": 92
    }],
    91: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document").Node;
        i.description = {
            name: "Node",
            remarks: ["Abstract node type."],
            properties: {
                source_id: "Useful for document conversion where the original id of an element should be remembered."
            }
        },
        e.exports = i
    }
    , {
        "../../../substance/document": 171
    }],
    92: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/application").View
          , o = t("../text/text_property_view")
          , r = function(t, e, n) {
            if (i.call(this, n),
            this.node = t,
            this.viewFactory = e,
            !e)
                throw new Error('Illegal argument. Argument "viewFactory" is mandatory.');
            this.$el.addClass("content-node").addClass(t.type.replace("_", "-")),
            this.el.dataset.id = this.node.id
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.content = document.createElement("DIV"),
                this.content.classList.add("content"),
                this.focusHandle = document.createElement("DIV"),
                this.focusHandle.classList.add("focus-handle"),
                this.el.appendChild(this.content),
                this.el.appendChild(this.focusHandle),
                this
            }
            ,
            this.dispose = function() {
                this.stopListening()
            }
            ,
            this.createView = function(t) {
                var e = this.node.document.get(t);
                return this.viewFactory.createView(e)
            }
            ,
            this.createTextView = function(t) {
                return console.error("FIXME: NodeView.createTextView() is deprecated. Use NodeView.createTextPropertyView() instead."),
                this.viewFactory.createView(this.node, t, "text")
            }
            ,
            this.createTextPropertyView = function(t, e) {
                return new o(this.node.document,t,this.viewFactory,e)
            }
            ,
            this.renderAnnotatedText = function(t, e) {
                return o.renderAnnotatedText(this.node.document, t, e, this.viewFactory)
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../../../substance/application": 158,
        "../text/text_property_view": 116
    }],
    93: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./paragraph"),
            View: t("./paragraph_view")
        }
    }
    , {
        "./paragraph": 94,
        "./paragraph_view": 95
    }],
    94: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../../substance/document")
          , r = o.Node
          , s = o.Composite
          , a = function(t, e) {
            s.call(this, t, e)
        };
        a.type = {
            id: "paragraph",
            parent: "content",
            properties: {
                children: ["array", "content"]
            }
        },
        a.description = {
            name: "Paragraph",
            remarks: ["A Paragraph can have inline elements such as images."],
            properties: {
                children: "An array of content node references"
            }
        },
        a.example = {
            type: "paragraph",
            id: "paragraph_1",
            "children ": ["text_1", "image_1", "text_2"]
        },
        (a.Prototype = function() {
            this.getLength = function() {
                return this.properties.children.length
            }
            ,
            this.getChildrenIds = function() {
                return i.clone(this.properties.children)
            }
            ,
            this.getChildren = function() {
                return i.map(this.properties.children, function(t) {
                    return this.document.get(t)
                }, this)
            }
        }
        ).prototype = s.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        r.defineProperties(a.prototype, ["children"]),
        e.exports = a
    }
    , {
        "../../../substance/document": 171,
        underscore: 183
    }],
    95: [function(t, e, n) {
        "use strict";
        var i = t("../composite/composite_view")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../composite/composite_view": 30
    }],
    96: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./publication_info"),
            View: t("./publication_info_view")
        }
    }
    , {
        "./publication_info": 97,
        "./publication_info_view": 98
    }],
    97: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Node.call(this, t, e)
        };
        o.type = {
            id: "publication_info",
            parent: "content",
            properties: {
                history: ["array", "object"],
                published_on: "string",
                journal: "string",
                provider: "string",
                article_type: "string",
                keywords: ["array", "string"],
                research_organisms: ["array", "string"],
                subjects: ["array", "string"],
                links: ["array", "objects"],
                doi: "string",
                related_article: "string",
                article_info: "paragraph",
                subject_link: "string",
                article_type_link: "string"
            }
        },
        o.description = {
            name: "PublicationInfo",
            description: "PublicationInfo Node",
            remarks: ["Summarizes the article's meta information. Meant to be customized by publishers"],
            properties: {
                received_on: "Submission received",
                accepted_on: "Paper accepted on",
                published_on: "Paper published on",
                history: "History of the submission cycle",
                journal: "The Journal",
                provider: "Who is hosting this article",
                article_type: "Research Article vs. Insight, vs. Correction etc.",
                keywords: "Article's keywords",
                research_organisms: "Research Organisms",
                subjects: "Article Subjects",
                doi: "Article DOI",
                related_article: "DOI of related article if there is any"
            }
        },
        o.example = {
            id: "publication_info",
            published_on: "2012-11-13",
            history: [{
                type: "received",
                date: "2012-06-20"
            }, {
                type: "accepted",
                date: "2012-09-05"
            }],
            journal: "eLife",
            provider: "eLife",
            article_type: "Research Article",
            keywords: ["innate immunity", "histones", "lipid droplet", "anti-bacterial"],
            research_organisms: ["B. subtilis", "D. melanogaster", "E. coli", "Mouse"],
            subjects: ["Immunology", "Microbiology and infectious disease"],
            doi: "http://dx.doi.org/10.7554/eLife.00003"
        },
        (o.Prototype = function() {
            this.getArticleInfo = function() {
                return this.document.get("articleinfo")
            }
            ,
            this.getSubjectLinks = function() {
                return this.subjects.map(function(t) {
                    return {
                        name: t,
                        url: this.subject_link + "/" + t.replace(/ /g, "-").toLowerCase()
                    }
                }
                .bind(this))
            }
            ,
            this.getArticleTypeLink = function() {
                return {
                    name: this.article_type,
                    url: this.article_type_link + "/" + this.article_type.replace(/ /g, "-").toLowerCase()
                }
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    98: [function(t, e, n) {
        "use strict";
        var i = t("../node").View
          , o = t("../../../substance/application").$$
          , r = t("../../article_util")
          , s = {
            received: "received",
            accepted: "accepted",
            revised: "revised",
            corrected: "corrected",
            "rev-recd": "revised",
            "rev-request": "returned for modification",
            published: "published",
            default: "updated"
        }
          , a = function(t, e) {
            i.call(this, t, e)
        };
        (a.Prototype = function() {
            this.render = function() {
                i.prototype.render.call(this);
                var t = o(".meta-data");
                if (this.node.article_type) {
                    var e = o(".article-type.container", {
                        children: [o("div.label", {
                            text: "Article Type"
                        }), o("div.value", {
                            text: this.node.article_type
                        })]
                    });
                    t.appendChild(e)
                }
                if (this.node.subjects && this.node.subjects.length > 0) {
                    var n = o(".subject.container", {
                        children: [o("div.label", {
                            text: "Subject"
                        }), o("div.value", {
                            text: this.node.subjects.join(", ")
                        })]
                    });
                    t.appendChild(n)
                }
                if (this.node.research_organisms && this.node.research_organisms.length > 0) {
                    var r = o(".subject.container", {
                        children: [o("div.label", {
                            text: "Organism"
                        }), o("div.value", {
                            text: this.node.research_organisms.join(", ")
                        })]
                    });
                    t.appendChild(r)
                }
                if (this.node.keywords && this.node.keywords.length > 0) {
                    var s = o(".keywords.container", {
                        children: [o("div.label", {
                            text: "Palabras clave"
                        }), o("div.value", {
                            text: this.node.keywords.join(", ")
                        })]
                    });
                    t.appendChild(s)
                }
                if (this.node.doi) {
                    var a = o(".doi.container", {
                        children: [o("div.label", {
                            text: "DOI"
                        }), o("div.value", {
                            children: [o("a", {
                                href: "http://dx.doi.org/" + this.node.doi,
                                text: this.node.doi,
                                target: "_blank"
                            })]
                        })]
                    });
                    t.appendChild(a)
                }
                if (this.node.related_article) {
                    var c = o(".related-article.container", {
                        children: [o("div.label", {
                            text: "Related Article"
                        }), o("div.value", {
                            children: [o("a", {
                                href: this.node.related_article,
                                text: this.node.related_article
                            })]
                        })]
                    });
                    t.appendChild(c)
                }
                var l = this.describePublicationHistory();
                t.appendChild(l),
                this.content.appendChild(t);
                var u = this.node.getArticleInfo()
                  , p = this.viewFactory.createView(u).render().el;
                return this.content.appendChild(p),
                this
            }
            ,
            this.describePublicationHistory = function() {
                var t, e = o(".dates"), n = [];
                if (this.node.history && this.node.history.length > 0 && (n = n.concat(this.node.history)),
                this.node.published_on && n.push({
                    type: "published",
                    date: this.node.published_on
                }),
                n.length > 0) {
                    for (e.appendChild(document.createTextNode("The article was ")),
                    t = 0; t < n.length; t++) {
                        t > 0 && (e.appendChild(document.createTextNode(", ")),
                        t === n.length - 1 && e.appendChild(document.createTextNode("and ")));
                        var i = n[t];
                        e.appendChild(document.createTextNode((s[i.type] || s.default) + " on ")),
                        e.appendChild(o("b", {
                            text: r.formatDate(i.date)
                        }))
                    }
                    e.appendChild(document.createTextNode("."))
                }
                return e
            }
            ,
            this.dispose = function() {
                i.prototype.dispose.call(this)
            }
        }
        ).prototype = i.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../article_util": 4,
        "../node": 90
    }],
    99: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./quote"),
            View: t("./quote_view")
        }
    }
    , {
        "./quote": 100,
        "./quote_view": 101
    }],
    100: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document")
          , o = i.Composite
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "quote",
            parent: "content",
            properties: {
                source_id: "string",
                label: "string",
                children: ["array", "paragraph"]
            }
        },
        r.description = {
            name: "Quote",
            remarks: ["A quote type."],
            properties: {
                label: "string",
                children: "0..n Paragraph nodes"
            }
        },
        r.example = {
            id: "quote_1",
            type: "quote",
            label: "Quote 1",
            children: ["paragraph_1", "paragraph_2"]
        },
        (r.Prototype = function() {
            this.getChildrenIds = function() {
                return this.properties.children
            }
        }
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171
    }],
    101: [function(t, e, n) {
        "use strict";
        var i = t("../node").View
          , o = t("../composite").View
          , r = t("../../../substance/application").$$
          , s = function(t, e) {
            o.call(this, t, e)
        };
        (s.Prototype = function() {
            this.render = function() {
                if (i.prototype.render.call(this),
                this.node.label) {
                    var t = r(".label", {
                        text: this.node.label
                    });
                    this.content.appendChild(t)
                }
                return this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
        }
        ).prototype = o.prototype,
        s.prototype = new s.Prototype,
        e.exports = s
    }
    , {
        "../../../substance/application": 158,
        "../composite": 31,
        "../node": 90
    }],
    102: [function(t, e, n) {
        e.exports = {
            Model: t("./resource_reference.js"),
            View: t("./resource_reference_view.js")
        }
    }
    , {
        "./resource_reference.js": 103,
        "./resource_reference_view.js": 104
    }],
    103: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = t("../annotation/annotation")
          , r = function(t, e) {
            o.call(this, t, e)
        };
        r.type = {
            id: "resource_reference",
            parent: "annotation",
            properties: {
                target: "node"
            }
        },
        (r.Prototype = function() {}
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        r.fragmentation = o.NEVER,
        i.Node.defineProperties(r),
        e.exports = r
    }
    , {
        "../../../substance/document": 171,
        "../annotation/annotation": 8
    }],
    104: [function(t, e, n) {
        "use strict";
        var i = t("../annotation/annotation_view")
          , o = function(t, e) {
            i.call(this, t, e),
            this.$el.addClass("resource-reference")
        };
        (o.Prototype = function() {
            this.createElement = function() {
                var t = document.createElement("a");
                return t.setAttribute("href", ""),
                t
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../annotation/annotation_view": 9
    }],
    105: [function(t, e, n) {
        e.exports = {
            Model: t("./strong.js"),
            View: t("../annotation/annotation_view.js")
        }
    }
    , {
        "../annotation/annotation_view.js": 9,
        "./strong.js": 106
    }],
    106: [function(t, e, n) {
        var i = t("../annotation/annotation")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "strong",
            parent: "annotation",
            properties: {}
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        o.fragmentation = i.DONT_CARE,
        e.exports = o
    }
    , {
        "../annotation/annotation": 8
    }],
    107: [function(t, e, n) {
        e.exports = {
            Model: t("./subscript.js"),
            View: t("../annotation/annotation_view.js")
        }
    }
    , {
        "../annotation/annotation_view.js": 9,
        "./subscript.js": 108
    }],
    108: [function(t, e, n) {
        var i = t("../annotation/annotation")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "subscript",
            parent: "annotation",
            properties: {}
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        o.fragmentation = i.DONT_CARE,
        e.exports = o
    }
    , {
        "../annotation/annotation": 8
    }],
    109: [function(t, e, n) {
        e.exports = {
            Model: t("./superscript.js"),
            View: t("../annotation/annotation_view.js")
        }
    }
    , {
        "../annotation/annotation_view.js": 9,
        "./superscript.js": 110
    }],
    110: [function(t, e, n) {
        var i = t("../annotation/annotation")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "superscript",
            parent: "annotation",
            properties: {}
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        o.fragmentation = i.DONT_CARE,
        e.exports = o
    }
    , {
        "../annotation/annotation": 8
    }],
    111: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./supplement"),
            View: t("./supplement_view")
        }
    }
    , {
        "./supplement": 112,
        "./supplement_view": 113
    }],
    112: [function(t, e, n) {
        t("underscore");
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "supplement",
            parent: "content",
            properties: {
                source_id: "string",
                label: "string",
                url: "string",
                caption: "caption"
            }
        },
        o.description = {
            name: "Supplement",
            remarks: ["A Supplement entity."],
            properties: {
                source_id: "Supplement id as it occurs in the source NLM file",
                label: "Supplement label",
                caption: "References a caption node, that has all the content",
                url: "URL of downloadable file"
            }
        },
        o.example = {
            id: "supplement_1",
            source_id: "SD1-data",
            type: "supplement",
            label: "Supplementary file 1.",
            url: "http://myserver.com/myfile.pdf",
            caption: "caption_supplement_1"
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.caption && t.push(this.properties.caption),
                t
            }
            ,
            this.getCaption = function() {
                return this.properties.caption ? this.document.get(this.properties.caption) : null
            }
            ,
            this.getHeader = function() {
                return this.properties.label
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171,
        underscore: 183
    }],
    113: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../composite").View
          , r = t("../../../substance/application").$$
          , s = t("../../resource_view")
          , a = function(t, e, n) {
            o.call(this, t, e),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.renderBody = function() {
                this.renderChildren();
                var t = r("div.file", {
                    children: [r("a", {
                        href: this.node.url,
                        html: '<i class="fa fa-download"/> Download'
                    })]
                });
                this.content.appendChild(t)
            }
        }
        ).prototype = o.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../resource_view": 125,
        "../composite": 31,
        underscore: 183
    }],
    114: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./text_node"),
            View: t("./text_view")
        }
    }
    , {
        "./text_node": 115,
        "./text_view": 117
    }],
    115: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document");
        e.exports = i.TextNode
    }
    , {
        "../../../substance/document": 171
    }],
    116: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/util").Fragmenter
          , o = t("../../../substance/application").View
          , r = function(t, e, n, i) {
            (i = i || {}).elementType = i.elementType || "span",
            o.call(this, i),
            this.path = e,
            this.document = t,
            this.viewFactory = n,
            this.options = i || {},
            this.property = t.resolve(this.path),
            this.$el.addClass("text"),
            this.options.classes && this.$el.addClass(this.options.classes)
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.el.innerHTML = "",
                r.renderAnnotatedText(this.document, this.path, this.el, this.viewFactory),
                this
            }
            ,
            this.dispose = function() {
                this.stopListening()
            }
            ,
            this.renderWithAnnotations = function(t) {
                var e = this
                  , n = this.property.get()
                  , o = document.createDocumentFragment()
                  , r = this.document
                  , s = []
                  , a = new i;
                a.onText = function(t, e) {
                    t.appendChild(document.createTextNode(e))
                }
                ,
                a.onEnter = function(t, n) {
                    var i = r.get(t.id)
                      , o = e.viewFactory.createView(i);
                    return n.appendChild(o.el),
                    s.push(o),
                    o.el
                }
                ,
                a.start(o, n, t);
                for (var c = 0; c < s.length; c++)
                    s[c].render();
                this.el.innerHTML = "",
                this.el.appendChild(o)
            }
        }
        ).prototype = o.prototype,
        r.prototype = new r.Prototype,
        r.renderAnnotatedText = function(t, e, n, o) {
            var r = window.document.createDocumentFragment()
              , s = t.get(e)
              , a = t.getIndex("annotations").get(e)
              , c = []
              , l = new i;
            l.onText = function(t, e) {
                t.appendChild(window.document.createTextNode(e))
            }
            ,
            l.onEnter = function(e, n) {
                var i = t.get(e.id)
                  , r = o.createView(i);
                return n.appendChild(r.el),
                c.push(r),
                r.el
            }
            ,
            l.start(r, s, a);
            for (var u = 0; u < c.length; u++)
                c[u].render();
            n.appendChild(r)
        }
        ,
        e.exports = r
    }
    , {
        "../../../substance/application": 158,
        "../../../substance/util": 180
    }],
    117: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/util").Fragmenter
          , o = t("../node/node_view")
          , r = t("../../../substance/application").$$
          , s = function(t, e, n) {
            o.call(this, t, e),
            n = this.options = n || {},
            this.path = n.path || [t.id, "content"],
            this.property = t.document.resolve(this.path),
            this.$el.addClass("text"),
            n.classes && this.$el.addClass(n.classes),
            n.path && this.$el.removeClass("content-node"),
            this._annotations = {}
        };
        (s.Prototype = function() {
            this.render = function() {
                return o.prototype.render.call(this),
                this.renderContent(),
                this
            }
            ,
            this.dispose = function() {
                o.prototype.dispose.call(this)
            }
            ,
            this.renderContent = function() {
                this.content.innerHTML = "",
                this._annotations = this.node.document.getIndex("annotations").get(this.path),
                this.renderWithAnnotations(this._annotations)
            }
            ,
            this.createAnnotationElement = function(t) {
                return this.options.createAnnotationElement ? this.options.createAnnotationElement.call(this, t) : "link" === t.type ? r("a.annotation." + t.type, {
                    id: t.id,
                    href: this.node.document.get(t.id).url
                }) : r("span.annotation." + t.type, {
                    id: t.id
                })
            }
            ,
            this.renderWithAnnotations = function(t) {
                var e = this
                  , n = this.property.get()
                  , o = document.createDocumentFragment()
                  , r = this.node.document
                  , s = []
                  , a = new i;
                a.onText = function(t, e) {
                    t.appendChild(document.createTextNode(e))
                }
                ,
                a.onEnter = function(t, n) {
                    var i = r.get(t.id)
                      , o = e.viewFactory.createView(i);
                    return n.appendChild(o.el),
                    s.push(o),
                    o.el
                }
                ,
                a.start(o, n, t);
                for (var c = 0; c < s.length; c++)
                    s[c].render();
                this.content.innerHTML = "",
                this.content.appendChild(o)
            }
        }
        ).prototype = o.prototype,
        s.prototype = new s.Prototype,
        e.exports = s
    }
    , {
        "../../../substance/application": 158,
        "../../../substance/util": 180,
        "../node/node_view": 92
    }],
    118: [function(t, e, n) {
        e.exports = {
            Model: t("./underline.js"),
            View: t("../annotation/annotation_view.js")
        }
    }
    , {
        "../annotation/annotation_view.js": 9,
        "./underline.js": 119
    }],
    119: [function(t, e, n) {
        var i = t("../annotation/annotation")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "underline",
            parent: "annotation",
            properties: {}
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        o.fragmentation = i.DONT_CARE,
        e.exports = o
    }
    , {
        "../annotation/annotation": 8
    }],
    120: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./video"),
            View: t("./video_view")
        }
    }
    , {
        "./video": 121,
        "./video_view": 122
    }],
    121: [function(t, e, n) {
        var i = t("../../../substance/document")
          , o = function(t, e) {
            i.Node.call(this, t, e)
        };
        o.type = {
            id: "video",
            parent: "content",
            properties: {
                source_id: "string",
                label: "string",
                url: "string",
                url_webm: "string",
                url_ogv: "string",
                caption: "caption",
                poster: "string"
            }
        },
        o.config = {
            zoomable: !0
        },
        o.description = {
            name: "Video",
            remarks: ["A video type intended to refer to video resources.", "MP4, WebM and OGV formats are supported."],
            properties: {
                label: "Label shown in the resource header.",
                url: "URL to mp4 version of the video.",
                url_webm: "URL to WebM version of the video.",
                url_ogv: "URL to OGV version of the video.",
                poster: "Video poster image.",
                caption: "References a caption node, that has all the content"
            }
        },
        o.example = {
            id: "video_1",
            type: "video",
            label: "Video 1.",
            url: "https://cdn.elifesciences.org/video/eLifeLensIntro2.mp4",
            url_webm: "https://cdn.elifesciences.org/video/eLifeLensIntro2.webm",
            url_ogv: "https://cdn.elifesciences.org/video/eLifeLensIntro2.ogv",
            poster: "https://cdn.elifesciences.org/video/eLifeLensIntro2.png",
            caption: "caption_25"
        },
        (o.Prototype = function() {
            this.getHeader = function() {
                return this.properties.label
            }
            ,
            this.getCaption = function() {
                return this.properties.caption ? this.document.get(this.properties.caption) : ""
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    122: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../../substance/application").$$
          , r = t("../node").View
          , s = t("../../resource_view")
          , a = function(t, e, n) {
            r.call(this, t, e),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.isZoomable = !0,
            this.renderBody = function() {
                var t = this.node
                  , e = [o("source", {
                    src: t.url,
                    type: "video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;"
                })];
                t.url_ogv && e.push(o("source", {
                    src: t.url_ogv,
                    type: "video/ogg; codecs=&quot;theora, vorbis&quot;"
                })),
                t.url_webm && e.push(o("source", {
                    src: t.url_webm,
                    type: "video/webm"
                }));
                var n = o(".video-wrapper", {
                    children: [o("video", {
                        controls: "controls",
                        poster: t.poster,
                        preload: "none",
                        children: e
                    })]
                });
                if (this.content.appendChild(n),
                t.title && this.content.appendChild(o(".title", {
                    text: t.title
                })),
                this.node.caption) {
                    var i = this.createView(this.node.caption);
                    this.content.appendChild(i.render().el),
                    this.captionView = i
                }
                t.doi && this.content.appendChild(o(".doi", {
                    children: [o("b", {
                        text: "DOI: "
                    }), o("a", {
                        href: t.doi,
                        target: "_new",
                        text: t.doi
                    })]
                }))
            }
        }
        ).prototype = r.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../../../substance/application": 158,
        "../../resource_view": 125,
        "../node": 90,
        underscore: 183
    }],
    123: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./web_resource"),
            View: t("../node").View
        }
    }
    , {
        "../node": 90,
        "./web_resource": 124
    }],
    124: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/document").Node
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "webresource",
            parent: "content",
            properties: {
                source_id: "string",
                url: "string"
            }
        },
        o.description = {
            name: "WebResource",
            description: "A resource which can be accessed via URL",
            remarks: ["This element is a parent for several other nodes such as Image."],
            properties: {
                url: "URL to a resource"
            }
        },
        o.example = {
            type: "webresource",
            id: "webresource_3",
            url: "http://elife.elifesciences.org/content/elife/1/e00311/F3.medium.gif"
        },
        (o.Prototype = function() {}
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.defineProperties(o.prototype, ["url"]),
        e.exports = o
    }
    , {
        "../../../substance/document": 171
    }],
    125: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("./nodes/node").View
          , r = t("../substance/application").$$
          , s = {
            header: !1,
            zoom: !1
        }
          , a = function(t) {
            this.options = i.extend({}, s, t)
        };
        a.Prototype = function() {
            this.isResourceView = !0,
            this.render = function() {
                return o.prototype.render.call(this),
                this.renderHeader(),
                this.renderBody(),
                this
            }
            ,
            this.renderHeader = function() {
                this.node;
                if (this.options.header) {
                    var t = r(".resource-header");
                    t.appendChild(this.renderLabel());
                    var e = r(".toggles");
                    this.options.zoom && e.appendChild(r("a.toggle.toggle-fullscreen", {
                        href: "#",
                        html: '<i class="fa fa-expand"></i> Fullscreen'
                    })),
                    e.appendChild(r("a.toggle-res.toggle.action-toggle-resource", {
                        href: "#",
                        html: '<i class="fa fa-eye"></i> Focus'
                    })),
                    t.appendChild(e),
                    this.headerEl = t,
                    this.el.insertBefore(t, this.content)
                }
            }
            ,
            this.renderLabel = function() {
                return r("div.name", {
                    html: this.getHeader()
                })
            }
            ,
            this.renderBody = function() {}
            ,
            this.getHeader = function() {
                return this.node.getHeader()
            }
        }
        ,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../substance/application": 158,
        "./nodes/node": 90,
        underscore: 183
    }],
    126: [function(t, e, n) {
        var i = function(t, e) {
            this.nodeTypes = t,
            this.options = e || {}
        };
        i.Prototype = function() {
            this.getNodeViewClass = function(t, e) {
                e = e || t.type;
                var n = this.nodeTypes[e];
                if (!n)
                    throw new Error("No node registered for type " + e + ".");
                var i = n.View;
                if (!i)
                    throw new Error('No view registered for type "' + t.type + '".');
                return i
            }
            ,
            this.createView = function(t, e, n) {
                return new (this.getNodeViewClass(t, n))(t,this,e)
            }
        }
        ,
        i.prototype = new i.Prototype,
        e.exports = i
    }
    , {}],
    127: [function(t, e, n) {
        "use strict";
        var i = t("./lens_converter");
        e.exports = i
    }
    , {
        "./lens_converter": 128
    }],
    128: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../substance/util")
          , r = o.errors.define("ImporterError")
          , s = t("../article")
          , a = function(t) {
            this.options = t || a.DefaultOptions
        };
        a.Prototype = function() {
            this._annotationTypes = {
                bold: "strong",
                italic: "emphasis",
                monospace: "code",
                sub: "subscript",
                sup: "superscript",
                sc: "custom_annotation",
                roman: "custom_annotation",
                "sans-serif": "custom_annotation",
                "styled-content": "custom_annotation",
                underline: "underline",
                "ext-link": "link",
                xref: "",
                email: "link",
                "named-content": "",
                "inline-formula": "inline-formula",
                uri: "link"
            },
            this._inlineNodeTypes = {
                fn: !0
            },
            this._refTypeMapping = {
                bibr: "citation_reference",
                fig: "figure_reference",
                table: "figure_reference",
                "supplementary-material": "figure_reference",
                other: "figure_reference",
                list: "definition_reference",
                fn: "footnote_reference"
            },
            this._contribTypeMapping = {
                author: "Author",
                "author non-byline": "Author",
                autahor: "Author",
                auther: "Author",
                editor: "Editor",
                "guest-editor": "Guest Editor",
                "group-author": "Group Author",
                collab: "Collaborator",
                "reviewed-by": "Reviewer",
                "nominated-by": "Nominator",
                corresp: "Corresponding Author",
                other: "Other",
                "assoc-editor": "Associate Editor",
                "associate editor": "Associate Editor",
                "series-editor": "Series Editor",
                contributor: "Contributor",
                chairman: "Chairman",
                "monographs-editor": "Monographs Editor",
                "contrib-author": "Contributing Author",
                organizer: "Organizer",
                chair: "Chair",
                discussant: "Discussant",
                presenter: "Presenter",
                "guest-issue-editor": "Guest Issue Editor",
                participant: "Participant",
                translator: "Translator"
            },
            this.isAnnotation = function(t) {
                return void 0 !== this._annotationTypes[t]
            }
            ,
            this.isInlineNode = function(t) {
                return void 0 !== this._inlineNodeTypes[t]
            }
            ,
            this.isParagraphish = function(t) {
                for (var e = 0; e < t.childNodes.length; e++) {
                    var n = t.childNodes[e];
                    if (n.nodeType !== Node.TEXT_NODE && !this.isAnnotation(n.tagName.toLowerCase()))
                        return !1
                }
                return !0
            }
            ,
            this.test = function(t, e) {
                return !0
            }
            ,
            this.getName = function(t) {
                if (!t)
                    return "N/A";
                var e = []
                  , n = t.querySelector("surname")
                  , i = t.querySelector("given-names")
                  , o = t.querySelector("suffix");
                return i && e.push(i.textContent),
                n && e.push(n.textContent),
                o && "" !== o.textContent.trim() ? [e.join(" "), o.textContent].join(", ") : e.join(" ")
            }
            ,
            this.toHtml = function(t) {
                if (!t)
                    return "";
                var e = document.createElement("DIV");
                return e.appendChild(t.cloneNode(!0)),
                e.innerHTML
            }
            ,
            this.mmlToHtmlString = function(t) {
                var e = this.toHtml(t);
                return e = e.replace(/<(\/)?mml:([^>]+)>/g, "<$1$2>")
            }
            ,
            this.selectDirectChildren = function(t, e) {
                for (var n = [], i = t.querySelectorAll(e), o = 0; o < i.length; o++) {
                    var r = i[o];
                    r.parentElement === t && n.push(r)
                }
                return n
            }
            ,
            this.import = function(t) {
                var e;
                i.isString(t) ? e = (new DOMParser).parseFromString(t, "text/xml") : e = t;
                this.sanitizeXML(e);
                var n = this.createDocument();
                window.doc = n;
                var o = this.createState(e, n);
                return this.document(o, e)
            }
            ,
            this.sanitizeXML = function(t) {}
            ,
            this.createState = function(t, e) {
                return new a.State(this,t,e)
            }
            ,
            this.createDocument = function() {
                return new s
            }
            ,
            this.show = function(t, e) {
                i.each(e, function(e) {
                    this.showNode(t, e)
                }, this)
            }
            ,
            this.extractDate = function(t) {
                if (!t)
                    return null;
                var e = t.querySelector("year")
                  , n = t.querySelector("month")
                  , i = t.querySelector("day")
                  , o = [e.textContent];
                return n && o.push(n.textContent),
                i && o.push(i.textContent),
                o.join("-")
            }
            ,
            this.extractPublicationInfo = function(t, e) {
                for (var n = t.doc, z = e.querySelector("kwd-group"), i = e.querySelector("article-meta"), o = i.querySelector("pub-date"), r = i.querySelectorAll("history date"), s = e.querySelector("journal-title"), a = e.querySelector("article-id[pub-id-type=doi]"), c = e.querySelector("related-article"), l = this.extractArticleInfo(t, e), u = this.extractFundingInfo(t, e), p = {
                    id: "publication_info",
                    type: "publication_info",
                    published_on: this.extractDate(o),
                    journal: s ? s.textContent : "",
                    related_article: c ? c.getAttribute("xlink:href") : "",
                    doi: a ? a.textContent : "",
                    article_info: l.id,
                    funding_info: u,
                    article_type: "",
                    keywords: [z.textContent],
                    links: [],
                    subjects: [],
                    supplements: [],
                    history: [],
                    research_organisms: [],
                    provider: ""
                }, h = 0; h < r.length; h++) {
                    var d = r[h]
                      , f = {
                        type: d.getAttribute("date-type"),
                        date: this.extractDate(d)
                    };
                    p.history.push(f)
                }
                n.create(p),
                n.show("info", p.id, 0),
                this.enhancePublicationInfo(t, p)
            }
            ,
            this.extractArticleInfo = function(t, e) {
                var n = {
                    id: "articleinfo",
                    type: "paragraph"
                }
                  , i = t.doc
                  , o = [];
                return o = (o = (o = (o = (o = (o = o.concat(this.extractEditor(t, e))).concat(this.extractDatasets(t, e))).concat(this.extractCustomMetaGroup(t, e))).concat(this.extractAcknowledgements(t, e))).concat(this.extractCopyrightAndLicense(t, e))).concat(this.extractNotes(t, e)),
                n.children = o,
                i.create(n),
                n
            }
            ,
            this.extractFundingInfo = function(t, e) {
                var n = []
                  , i = e.querySelectorAll("funding-statement");
                if (i.length > 0)
                    for (var o = 0; o < i.length; o++)
                        n.push(this.annotatedText(t, i[o], ["publication_info", "funding_info", o]));
                return n
            }
            ,
            this.extractEditor = function(t, e) {
                var n = []
                  , i = t.doc
                  , o = e.querySelector("contrib[contrib-type=editor]");
                if (o) {
                    var r = []
                      , s = this.getName(o.querySelector("name"));
                    s && r.push(s);
                    var a = o.querySelector("institution");
                    a && r.push(a.textContent);
                    var c = o.querySelector("country");
                    c && r.push(c.textContent);
                    var l = {
                        type: "heading",
                        id: t.nextId("heading"),
                        level: 3,
                        content: "Reviewing Editor"
                    };
                    i.create(l),
                    n.push(l.id);
                    var u = {
                        type: "text",
                        id: t.nextId("text"),
                        content: r.join(", ")
                    };
                    i.create(u),
                    n.push(u.id)
                }
                return n
            }
            ,
            this.extractDatasets = function(t, e) {
                for (var n = [], i = t.doc, r = e.querySelectorAll("sec"), s = 0; s < r.length; s++) {
                    var a = r[s];
                    if ("datasets" === a.getAttribute("sec-type")) {
                        var c = {
                            type: "heading",
                            id: t.nextId("heading"),
                            level: 3,
                            content: "Major Datasets"
                        };
                        i.create(c),
                        n.push(c.id);
                        for (var l = this.datasets(t, o.dom.getChildren(a)), u = 0; u < l.length; u++)
                            l[u] && n.push(l[u])
                    }
                }
                return n
            }
            ;
            var t = function(e, n) {
                return n ? e.split(" ").map(function(e) {
                    return t(e)
                }).join(" ") : e.charAt(0).toUpperCase() + e.slice(1)
            };
            this.capitalized = function(e, n) {
                return t(e, n)
            }
            ,
            this.extractAcknowledgements = function(t, e) {
                var n = []
                  , r = t.doc
                  , s = e.querySelectorAll("ack");
                return s && s.length > 0 && i.each(s, function(e) {
                    var s = e.querySelector("title")
                      , a = {
                        type: "heading",
                        id: t.nextId("heading"),
                        level: 3,
                        content: s ? this.capitalized(s.textContent.toLowerCase(), "all") : "Acknowledgements"
                    };
                    r.create(a),
                    n.push(a.id);
                    var c = this.bodyNodes(t, o.dom.getChildren(e), {
                        ignore: ["title"]
                    });
                    i.each(c, function(t) {
                        n.push(t.id)
                    })
                }, this),
                n
            }
            ,
            this.extractNotes = function(t, e) {
                return []
            }
            ,
            this.__ignoreCustomMetaNames = [],
            this.extractCustomMetaGroup = function(t, e) {
                var n = []
                  , o = t.doc
                  , r = e.querySelectorAll("article-meta custom-meta");
                if (0 === r.length)
                    return n;
                for (var s = 0; s < r.length; s++) {
                    var a = r[s]
                      , c = a.querySelector("meta-name")
                      , l = a.querySelector("meta-value");
                    if (!i.include(this.__ignoreCustomMetaNames, c.textContent)) {
                        var u = {
                            type: "heading",
                            id: t.nextId("heading"),
                            level: 3,
                            content: ""
                        };
                        u.content = this.annotatedText(t, c, [u.id, "content"]),
                        o.create(u);
                        var p = this.paragraphGroup(t, l);
                        n.push(u.id),
                        n = n.concat(i.pluck(p, "id"))
                    }
                }
                return n
            }
            ,
            this.extractCopyrightAndLicense = function(t, e) {
                var n = []
                  , r = t.doc
                  , s = e.querySelector("permissions");
                if (s) {
                    var a, c = {
                        type: "heading",
                        id: t.nextId("heading"),
                        level: 3,
                        content: "Copyright & License"
                    };
                    r.create(c),
                    n.push(c.id);
                    var l = s.querySelector("copyright-statement");
                    if (l && (a = this.paragraphGroup(t, l)) && a.length && (n = n.concat(i.map(a, function(t) {
                        return t.id
                    })),
                    "." !== l.textContent.trim().slice(-1))) {
                        var u = i.last(i.last(a).children);
                        r.nodes[u].content += ". "
                    }
                    var p = s.querySelector("license");
                    if (p)
                        for (var h = p.firstElementChild; h; h = h.nextElementSibling) {
                            var d = o.dom.getNodeType(h);
                            "p" !== d && "license-p" !== d || (a = this.paragraphGroup(t, h)) && a.length && (n = n.concat(i.pluck(a, "id")))
                        }
                }
                return n
            }
            ,
            this.extractCover = function(t, e) {
                var n = t.doc
                  , o = n.get("document")
                  , r = {
                    id: "cover",
                    type: "cover",
                    title: o.title,
                    authors: [],
                    abstract: o.abstract
                };
                i.each(o.authors, function(e) {
                    var i = n.get(e)
                      , o = {
                        id: "text_" + e + "_reference",
                        type: "text",
                        content: i.name
                    };
                    n.create(o),
                    r.authors.push(o.id);
                    var s = {
                        id: t.nextId("contributor_reference"),
                        type: "contributor_reference",
                        path: ["text_" + e + "_reference", "content"],
                        range: [0, i.name.length],
                        target: e
                    };
                    n.create(s)
                }, this),
                this.enhanceCover(t, r, e),
                n.create(r),
                n.show("content", r.id, 0)
            }
            ,
            this.contribGroup = function(t, e) {
                var n, i = e.querySelectorAll("contrib");
                for (n = 0; n < i.length; n++)
                    this.contributor(t, i[n]);
                var o = t.doc
                  , r = e.querySelector("on-behalf-of");
                r && (o.on_behalf_of = r.textContent.trim())
            }
            ,
            this.affiliation = function(t, e) {
                var n = t.doc;
                if (o = e.querySelector("institution[content-type=dept]"))
                    var i = e.querySelector("institution:not([content-type=dept])");
                else {
                    var o = e.querySelector("addr-line named-content[content-type=department]");
                    i = e.querySelector("institution")
                }
                var r = e.querySelector("country")
                  , s = e.querySelector("label")
                  , a = e.querySelector("addr-line named-content[content-type=city]")
                  , c = e.getAttribute("specific-use")
                  , l = {
                    id: t.nextId("affiliation"),
                    type: "affiliation",
                    source_id: e.getAttribute("id"),
                    label: s ? s.textContent : null,
                    department: o ? o.textContent : null,
                    city: a ? a.textContent : null,
                    institution: i ? i.textContent : null,
                    country: r ? r.textContent : null,
                    specific_use: c || null
                };
                n.create(l)
            }
            ,
            this.contributor = function(t, e) {
                var n = t.doc
                  , r = t.nextId("contributor")
                  , s = {
                    id: r,
                    source_id: e.getAttribute("id"),
                    type: "contributor",
                    name: "",
                    affiliations: [],
                    fundings: [],
                    bio: [],
                    image: "",
                    deceased: !1,
                    emails: [],
                    contribution: "",
                    members: []
                }
                  , a = e.getAttribute("contrib-type");
                s.contributor_type = this._contribTypeMapping[a];
                var c = e.querySelector("role");
                c && (s.role = c.textContent);
                var l = e.querySelector("bio");
                l && i.each(o.dom.getChildren(l), function(e) {
                    var n = e.querySelector("graphic");
                    if (n) {
                        var i = n.getAttribute("xlink:href");
                        s.image = i
                    } else {
                        var o = this.paragraphGroup(t, e);
                        o.length > 0 && (s.bio = [o[0].id])
                    }
                }, this),
                "yes" === e.getAttribute("deceased") && (s.deceased = !0);
                var u = e.querySelector("contrib-id[contrib-id-type=orcid]");
                u && (s.orcid = u.textContent.trim());
                var p = e.querySelector("name");
                if (p)
                    s.name = this.getName(p);
                else {
                    var h = e.querySelector("collab");
                    s.name = h ? h.textContent : "N/A"
                }
                this.extractContributorProperties(t, e, s),
                0 === s.affiliations.length && (s.affiliations = t.affiliations),
                s.competing_interests.length > 1 && (s.competing_interests = i.filter(s.competing_interests, function(t) {
                    return t.indexOf("no competing") < 0
                })),
                "author" === e.getAttribute("contrib-type") && n.nodes.document.authors.push(r),
                n.create(s),
                n.show("info", s.id)
            }
            ,
            this._getEqualContribs = function(t, e, n) {
                var o = []
                  , r = t.xmlDoc.querySelectorAll("xref[rid=" + n + "]");
                return i.each(r, function(t) {
                    var n = t.parentNode;
                    n !== e && o.push(this.getName(n.querySelector("name")))
                }, this),
                o
            }
            ,
            this.extractContributorProperties = function(t, e, n) {
                var o = t.doc
                  , r = []
                  , s = []
                  , a = e.querySelectorAll("xref");
                i.each(a, function(i) {
                    if ("aff" === i.getAttribute("ref-type")) {
                        var a = i.getAttribute("rid")
                          , c = o.getNodeBySourceId(a);
                        c && (n.affiliations.push(c.id),
                        t.used[a] = !0)
                    } else if ("other" === i.getAttribute("ref-type")) {
                        console.log("FIXME: please add documentation about using 'other' as indicator for extracting an awardGroup.");
                        var l = t.xmlDoc.getElementById(i.getAttribute("rid"));
                        if (!l)
                            return;
                        var u = l.querySelector("funding-source");
                        if (!u)
                            return;
                        var p = l.querySelector("award-id");
                        p = p ? ", " + p.textContent : "";
                        var h = u.querySelector("institution")
                          , d = h ? h.textContent : u.childNodes[0].textContent;
                        n.fundings.push([d, p].join(""))
                    } else if ("corresp" === i.getAttribute("ref-type")) {
                        var f = i.getAttribute("rid")
                          , g = t.xmlDoc.getElementById(f);
                        if (!g)
                            return;
                        var y = g.querySelector("email");
                        if (!y)
                            return;
                        n.emails.push(y.textContent)
                    } else if ("fn" === i.getAttribute("ref-type")) {
                        var m = i.getAttribute("rid")
                          , v = t.xmlDoc.getElementById(m)
                          , b = !0;
                        if (v) {
                            switch (v.getAttribute("fn-type")) {
                            case "con":
                                v.getAttribute("id").indexOf("equal-contrib") >= 0 ? r = this._getEqualContribs(t, e, v.getAttribute("id")) : n.contribution = v.textContent;
                                break;
                            case "conflict":
                                s.push(v.textContent.trim());
                                break;
                            case "present-address":
                                n.present_address = v.querySelector("p").textContent;
                                break;
                            case "equal":
                                console.log("FIXME: isn't fnElem.getAttribute(id) === fnId?"),
                                r = this._getEqualContribs(t, e, v.getAttribute("id"));
                                break;
                            case "other":
                                console.log("FIXME: isn't fnElem.getAttribute(id) === fnId?"),
                                v.getAttribute("id").indexOf("equal-contrib") >= 0 ? r = this._getEqualContribs(t, e, v.getAttribute("id")) : b = !1;
                                break;
                            default:
                                b = !1
                            }
                            b && (t.used[m] = !0)
                        }
                    } else
                        console.log("Skipping contrib's xref", i.textContent)
                }, this),
                s.length > 1 && (s = i.filter(s, function(t) {
                    return t.indexOf("no competing") < 0
                })),
                n.competing_interests = s;
                var c = e.querySelector("xref[ref-type=other]");
                if (c) {
                    var l = c.getAttribute("rid")
                      , u = t.xmlDoc.querySelectorAll("#" + l + " contrib");
                    n.members = i.map(u, function(t) {
                        return this.getName(t.querySelector("name"))
                    }, this)
                }
                n.equal_contrib = r,
                n.competing_interests = s
            }
            ,
            this.document = function(t, e) {
                var n = t.doc
                  , o = e.querySelector("article");
                if (!o)
                    throw new r("Expected to find an 'article' element.");
                return this.article(t, o),
                this.postProcess(t),
                i.each(n.containers, function(t) {
                    t.rebuild()
                }),
                n
            }
            ,
            this.postProcess = function(t) {
                this.postProcessAnnotations(t)
            }
            ,
            this.postProcessAnnotations = function(t) {
                for (var e = 0; e < t.annotations.length; e++) {
                    var n = t.annotations[e];
                    if (n.target) {
                        var i = t.doc.getNodeBySourceId(n.target);
                        i && (n.target = i.id)
                    }
                    t.doc.create(t.annotations[e])
                }
            }
            ,
            this.article = function(t, e) {
                var n = t.doc
                  , i = e.querySelector("article-id");
                n.id = i ? i.textContent : o.uuid(),
                this.extractDefinitions(t, e),
                this.extractAffilitations(t, e),
                this.extractContributors(t, e),
                this.extractCitations(t, e),
                this.extractCover(t, e),
                this.extractArticleMeta(t, e),
                this.extractPublicationInfo(t, e);
                var r = e.querySelector("body");
                r && this.body(t, r),
                this.extractFigures(t, e),
                this.extractFootNotes(t, e);
                var s = e.querySelector("back");
                s && this.back(t, s),
                this.enhanceArticle(t, e)
            }
            ,
            this.extractDefinitions = function(t) {
                var e = t.xmlDoc.querySelectorAll("def-item");
                i.each(e, function(e) {
                    var n = e.querySelector("term")
                      , i = e.querySelector("def")
                      , o = {
                        id: i.id || i.getAttribute("hwp:id") || t.nextId("definition"),
                        type: "definition",
                        title: n.textContent,
                        description: i.textContent
                    };
                    t.doc.create(o),
                    t.doc.show("definitions", o.id)
                })
            }
            ,
            this.extractArticleMeta = function(t, e) {
                var n = e.querySelector("article-meta");
                if (!n)
                    throw new r("Expected element: 'article-meta'");
                var i = n.querySelectorAll("article-id");
                this.articleIds(t, i);
                var o = n.querySelector("title-group");
                o && this.titleGroup(t, o);
                var s = n.querySelectorAll("pub-date");
                this.pubDates(t, s),
                this.abstracts(t, n)
            }
            ,
            this.extractAffilitations = function(t, e) {
                for (var n = e.querySelectorAll("aff"), i = 0; i < n.length; i++)
                    this.affiliation(t, n[i])
            }
            ,
            this.extractContributors = function(t, e) {
                var n = e.querySelector("article-meta contrib-group");
                n && this.contribGroup(t, n)
            }
            ,
            this.extractFigures = function(t, e) {
                for (var n = e.querySelectorAll("fig, table-wrap, supplementary-material, media[mimetype=video]"), i = [], r = 0; r < n.length; r++) {
                    var s = n[r];
                    if (!s._converted) {
                        var a = o.dom.getNodeType(s)
                          , c = null;
                        "fig" === a ? c = this.figure(t, s) : "table-wrap" === a ? c = this.tableWrap(t, s) : "media" === a ? c = this.video(t, s) : "supplementary-material" === a && (c = this.supplement(t, s)),
                        c && i.push(c)
                    }
                }
                this.show(t, i)
            }
            ,
            this.extractFootNotes = function(t, e) {
                for (var n = e.querySelectorAll("fn"), i = 0; i < n.length; i++) {
                    var o = n[i];
                    o.__converted__ || this.footnote(t, o)
                }
            }
            ,
            this.extractCitations = function(t, e) {
                var n = e.querySelector("ref-list");
                n && this.refList(t, n)
            }
            ,
            this.articleIds = function(t, e) {
                var n = t.doc;
                e.length > 0 ? n.id = e[0].textContent : n.id = o.uuid()
            }
            ,
            this.titleGroup = function(t, e) {
                var n = t.doc
                  , i = e.querySelector("article-title");
                i && (n.title = this.annotatedText(t, i, ["document", "title"], {
                    ignore: ["xref"]
                }))
            }
            ,
            this.pubDates = function(t, e) {
                var n = t.doc;
                if (e.length > 0) {
                    var i = this.pubDate(t, e[0]);
                    n.created_at = i.date
                }
            }
            ,
            this.pubDate = function(t, e) {
                var n = -1
                  , r = -1
                  , s = -1;
                return i.each(o.dom.getChildren(e), function(t) {
                    var e = o.dom.getNodeType(t)
                      , i = t.textContent;
                    "day" === e ? n = parseInt(i, 10) : "month" === e ? r = parseInt(i, 10) : "year" === e && (s = parseInt(i, 10))
                }, this),
                {
                    date: new Date(s,r,n)
                }
            }
            ,
            this.abstracts = function(t, e) {
                var n = e.querySelectorAll("abstract");
                i.each(n, function(e) {
                    this.abstract(t, e)
                }, this)
            }
            ,
            this.abstract = function(t, e) {
                var n = t.doc                
                  , i = []                  
                  , r = e.querySelector("title")                                                      
                  , s = {
                    id: t.nextId("heading"),
                    type: "heading",
                    level: 1,                    
                    content: r ? r.textContent : "Abstract",                                   
                };               
                n.create(s),                                
                i.push(s),
                 //texto resumen                           
                
                (i = i.concat(this.bodyNodes(t, o.dom.getChildren(e), {
                    ignore: ["title", "object-id"]
                }))).length > 0 && this.show(t, i)
            }
            ,
            this.body = function(t, e) {
                t.doc;
                var n = this.bodyNodes(t, o.dom.getChildren(e));
                n.length > 0 && this.show(t, n)
            }
            ,
            this._ignoredBodyNodes = {
                fig: !0,
                "table-wrap": !0
            },
            this._bodyNodes = {},
            this.bodyNodes = function(t, e, n) {
                for (var r, s = [], a = 0; a < e.length; a++) {
                    var c = e[a]
                      , l = o.dom.getNodeType(c);
                    if (this._bodyNodes[l]) {
                        var u = this._bodyNodes[l].call(this, t, c);
                        i.isArray(u) ? s = s.concat(u) : u && s.push(u)
                    } else
                        this._ignoredBodyNodes[l] || n && n.ignore && n.ignore.indexOf(l) >= 0 ? (r = this.ignoredNode(t, c, l)) && s.push(r) : console.error("Node not supported as block-level element: " + l + "\n" + c.outerHTML)
                }
                return s
            }
            ,
            this._bodyNodes.p = function(t, e) {
                return this.paragraphGroup(t, e)
            }
            ,
            this._bodyNodes.sec = function(t, e) {
                return this.section(t, e)
            }
            ,
            this._bodyNodes.list = function(t, e) {
                return this.list(t, e)
            }
            ,
            this._bodyNodes["disp-formula"] = function(t, e) {
                return this.formula(t, e)
            }
            ,
            this._bodyNodes.caption = function(t, e) {
                return this.caption(t, e)
            }
            ,
            this._bodyNodes["boxed-text"] = function(t, e) {
                return this.boxedText(t, e)
            }
            ,
            this._bodyNodes["disp-quote"] = function(t, e) {
                return this.quoteText(t, e)
            }
            ,
            this._bodyNodes.attrib = function(t, e) {
                return this.paragraphGroup(t, e)
            }
            ,
            this._bodyNodes.comment = function(t, e) {
                return this.comment(t, e)
            }
            ,
            this.ignoredNode = function() {}
            ,
            this.comment = function() {
                return null
            }
            ,
            this.boxedText = function(t, e) {
                var n = t.doc
                  , r = this.bodyNodes(t, o.dom.getChildren(e))
                  , s = t.nextId("box")
                  , a = this.selectDirectChildren(e, "label")[0]
                  , c = {
                    type: "box",
                    id: s,
                    source_id: e.getAttribute("id"),
                    label: a ? a.textContent : "",
                    children: i.pluck(r, "id")
                };
                return n.create(c),
                c
            }
            ,
            this.quoteText = function(t, e) {
                var n = t.doc
                  , r = this.bodyNodes(t, o.dom.getChildren(e))
                  , s = {
                    type: "quote",
                    id: t.nextId("quote"),
                    source_id: e.getAttribute("id"),
                    label: "",
                    children: i.pluck(r, "id")
                };
                return n.create(s),
                s
            }
            ,
            this.datasets = function(t, e) {
                for (var n = [], i = 0; i < e.length; i++) {
                    var r = e[i];
                    if ("p" === o.dom.getNodeType(r)) {
                        var s = r.querySelector("related-object");
                        if (s)
                            n = n.concat(this.indivdata(t, s));
                        else {
                            var a = this.paragraphGroup(t, r);
                            a.length > 0 && n.push(a[0].id)
                        }
                    }
                }
                return n
            }
            ,
            this.indivdata = function(t, e) {
                var n = t.doc
                  , i = {
                    type: "paragraph",
                    id: t.nextId("paragraph"),
                    children: []
                }
                  , r = {
                    type: "text",
                    id: t.nextId("text"),
                    content: ""
                };
                i.children.push(r.id);
                for (var s = o.dom.getChildren(e), a = 0; a < s.length; a++) {
                    var c, l = s[a];
                    if ("name" === o.dom.getNodeType(l))
                        for (var u = o.dom.getChildren(l), p = 0; p < u.length; p++) {
                            var h = u[p];
                            if (0 === p)
                                c = this.paragraphGroup(t, h),
                                i.children.push(c[0].children[0]);
                            else {
                                var d = {
                                    type: "text",
                                    id: t.nextId("text"),
                                    content: ", "
                                };
                                n.create(d),
                                i.children.push(d.id),
                                c = this.paragraphGroup(t, h),
                                i.children.push(c[0].children[0])
                            }
                        }
                    else
                        (c = this.paragraphGroup(t, l)) && c[0] && c[0].children && i.children.push(c[0].children[0])
                }
                return n.create(i),
                n.create(r),
                i.id
            }
            ,
            this.section = function(t, e) {
                t.sectionLevel++;
                var n = t.doc
                  , i = o.dom.getChildren(e)
                  , r = []
                  , s = this.selectDirectChildren(e, "label")[0]
                  , a = this.selectDirectChildren(e, "title")[0];
                if (a || console.error("FIXME: every section should have a title", this.toHtml(e)),
                (r = r.concat(this.bodyNodes(t, i, {
                    ignore: ["title", "label"]
                }))).length > 0 && a) {
                    var c = t.nextId("heading")
                      , l = {
                        id: c,
                        source_id: e.getAttribute("id"),
                        type: "heading",
                        level: t.sectionLevel,
                        content: a ? this.annotatedText(t, a, [c, "content"]) : ""
                    };
                    s && (l.label = s.textContent),
                    l.content.length > 0 && (n.create(l),
                    r.unshift(l))
                } else
                    0 === r.length && console.info("NOTE: skipping section without content:", a ? a.innerHTML : "no title");
                return t.sectionLevel--,
                r
            }
            ,
            this.ignoredParagraphElements = {
                comment: !0,
                "supplementary-material": !0,
                fig: !0,
                "fig-group": !0,
                "table-wrap": !0,
                media: !0
            },
            this.acceptedParagraphElements = {
                "boxed-text": {
                    handler: "boxedText"
                },
                "disp-quote": {
                    handler: "quoteText"
                },
                list: {
                    handler: "list"
                },
                "disp-formula": {
                    handler: "formula"
                }
            },
            this.inlineParagraphElements = {
                "inline-graphic": !0,
                "inline-formula": !0,
                fn: !0
            },
            this.segmentParagraphElements = function(t) {
                for (var e = [], n = "", r = new o.dom.ChildNodeIterator(t); r.hasNext(); ) {
                    var s = r.next()
                      , a = o.dom.getNodeType(s);
                    this.ignoredParagraphElements[a] || (this.acceptedParagraphElements[a] ? (e.push(i.extend({
                        node: s
                    }, this.acceptedParagraphElements[a])),
                    n = a) : ("paragraph" !== n && (e.push({
                        handler: "paragraph",
                        nodes: []
                    }),
                    n = "paragraph"),
                    i.last(e).nodes.push(s)))
                }
                return e
            }
            ,
            this.paragraphGroup = function(t, e) {
                for (var n = [], i = this.segmentParagraphElements(e), o = 0; o < i.length; o++) {
                    var r, s = i[o];
                    "paragraph" === s.handler ? (r = this.paragraph(t, s.nodes)) && (r.source_id = e.getAttribute("id")) : r = this[s.handler](t, s.node),
                    r && n.push(r)
                }
                return n
            }
            ,
            this.paragraph = function(t, e) {
                var n = t.doc;
                t.skipWS = !0;
                for (var r = {
                    id: t.nextId("paragraph"),
                    type: "paragraph",
                    children: null
                }, s = [], a = new o.dom.ChildNodeIterator(e); a.hasNext(); ) {
                    var c = a.next()
                      , l = o.dom.getNodeType(c);
                    if ("text" === l || this.isAnnotation(l) || this.isInlineNode(l)) {
                        var u = {
                            id: t.nextId("text"),
                            type: "text",
                            content: null
                        };
                        t.stack.push({
                            path: [u.id, "content"]
                        });
                        var p = this._annotatedText(t, a.back(), {
                            offset: 0,
                            breakOnUnknown: !1
                        });
                        p.length > 0 && (u.content = p,
                        n.create(u),
                        s.push(u)),
                        t.stack.pop()
                    } else if ("inline-graphic" === l) {
                        var h = c.getAttribute("xlink:href")
                          , d = {
                            id: t.nextId("image"),
                            type: "image",
                            url: this.resolveURL(t, h)
                        };
                        n.create(d),
                        s.push(d)
                    } else if ("inline-formula" === l) {
                        var f = this.formula(t, c, "inline");
                        f && s.push(f)
                    }
                }
                return 0 === s.length ? null : (r.children = i.map(s, function(t) {
                    return t.id
                }),
                n.create(r),
                r)
            }
            ,
            this.list = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("list"),
                    source_id: e.getAttribute("id"),
                    type: "list",
                    items: [],
                    ordered: !1
                };
                "ordered" === e.getAttribute("list-type") && (i.ordered = !0);
                for (var r = e.querySelectorAll("list-item"), s = 0; s < r.length; s++) {
                    var a = r[s];
                    if (a.parentNode === e)
                        for (var c = this.bodyNodes(t, o.dom.getChildren(a)), l = 0; l < c.length; l++)
                            i.items.push(c[l].id)
                }
                return n.create(i),
                i
            }
            ,
            this.figure = function(t, e) {
                var n = t.doc
                  , i = {
                    type: "figure",
                    id: t.nextId("figure"),
                    source_id: e.getAttribute("id"),
                    label: "Figure",
                    url: "",
                    caption: null
                }
                  , o = e.querySelector("label");
                o && (i.label = this.annotatedText(t, o, [i.id, "label"]));
                var r = e.querySelector("caption");
                if (r) {
                    var s = this.caption(t, r);
                    s && (i.caption = s.id)
                }
                var a = e.querySelector("attrib");
                a && (i.attrib = a.textContent);
                var c = e.getAttribute("position");
                return c && (i.position = c || ""),
                this.enhanceFigure(t, i, e),
                n.create(i),
                e._converted = !0,
                i
            }
            ,
            this.supplement = function(t, e) {
                var n = t.doc
                  , i = e.querySelector("label")
                  , o = e.querySelector("media")
                  , r = o ? o.getAttribute("xlink:href") : null
                  , s = e.querySelector("object-id[pub-id-type='doi']");
                s = s ? "http://dx.doi.org/" + s.textContent : "";
                var a = {
                    id: t.nextId("supplement"),
                    source_id: e.getAttribute("id"),
                    type: "supplement",
                    label: i ? i.textContent : "",
                    url: r,
                    caption: null
                }
                  , c = e.querySelector("caption");
                if (c) {
                    var l = this.caption(t, c);
                    l && (a.caption = l.id)
                }
                return this.enhanceSupplement(t, a, e),
                n.create(a),
                a
            }
            ,
            this.caption = function(t, e) {
                var n = t.doc
                  , o = {
                    id: t.nextId("caption"),
                    source_id: e.getAttribute("id"),
                    type: "caption",
                    title: "",
                    children: []
                }
                  , r = e.querySelector("title");
                if (r) {
                    var s = this.paragraph(t, r);
                    s && (o.title = s.id)
                }
                var a = []
                  , c = e.querySelectorAll("p");
                return i.each(c, function(n) {
                    if (n.parentNode === e) {
                        var i = this.paragraph(t, n);
                        i && a.push(i.id)
                    }
                }, this),
                o.children = a,
                n.create(o),
                o
            }
            ,
            this.video = function(t, e) {
                var n = t.doc
                  , i = e.querySelector("label").textContent
                  , o = {
                    id: t.nextId("video"),
                    source_id: e.getAttribute("id"),
                    type: "video",
                    label: i,
                    title: "",
                    caption: null,
                    poster: ""
                }
                  , r = e.querySelector("caption");
                if (r) {
                    var s = this.caption(t, r);
                    s && (o.caption = s.id)
                }
                return this.enhanceVideo(t, o, e),
                n.create(o),
                o
            }
            ,
            this.tableWrap = function(t, e) {
                var n = t.doc
                  , i = e.querySelector("label")
                  , o = {
                    id: t.nextId("html_table"),
                    source_id: e.getAttribute("id"),
                    type: "html_table",
                    title: "",
                    label: i ? i.textContent : "Table",
                    content: "",
                    caption: null,
                    footers: []
                }
                  , r = e.querySelectorAll("table");
                if (r)
                    for (var s = 0; s < r.length; s++)
                        o.content += this.toHtml(r[s]);
                return this.extractTableCaption(t, o, e),
                this.enhanceTable(t, o, e),
                n.create(o),
                o
            }
            ,
            this.extractTableCaption = function(t, e, n) {
                var i = n.querySelector("caption");
                if (i) {
                    var o = this.caption(t, i);
                    o && (e.caption = o.id)
                } else
                    console.error("caption node not found for", n)
            }
            ,
            this._getFormulaData = function(t) {
                for (var e = [], n = t.firstElementChild; n; n = n.nextElementSibling) {
                    var i = o.dom.getNodeType(n);
                    switch (i) {
                    case "graphic":
                    case "inline-graphic":
                        e.push({
                            format: "image",
                            data: n.getAttribute("xlink:href")
                        });
                        break;
                    case "svg":
                        e.push({
                            format: "svg",
                            data: this.toHtml(n)
                        });
                        break;
                    case "mml:math":
                    case "math":
                        e.push({
                            format: "mathml",
                            data: this.mmlToHtmlString(n)
                        });
                        break;
                    case "tex-math":
                        e.push({
                            format: "latex",
                            data: n.textContent
                        });
                        break;
                    case "label":
                        break;
                    default:
                        console.error("Unsupported formula element of type " + i)
                    }
                }
                return e
            }
            ,
            this.formula = function(t, e, n) {
                var i = t.doc
                  , o = {
                    id: t.nextId("formula"),
                    source_id: e.getAttribute("id"),
                    type: "formula",
                    label: "",
                    inline: !!n,
                    data: [],
                    format: []
                }
                  , r = e.querySelector("label");
                r && (o.label = r.textContent);
                for (var s = this._getFormulaData(e, n), a = 0; a < s.length; a++)
                    o.format.push(s[a].format),
                    o.data.push(s[a].data);
                return i.create(o),
                o
            }
            ,
            this.footnote = function(t, e) {
                var n = t.doc
                  , o = {
                    type: "footnote",
                    id: t.nextId("fn"),
                    source_id: e.getAttribute("id"),
                    label: "",
                    children: []
                }
                  , r = e.children
                  , s = 0;
                for ("label" === r[s].tagName.toLowerCase() && (o.label = this.annotatedText(t, r[s], [o.id, "label"]),
                s++),
                o.children = []; s < r.length; s++) {
                    var a = this.paragraphGroup(t, r[s]);
                    Array.prototype.push.apply(o.children, i.pluck(a, "id"))
                }
                return n.create(o),
                e.__converted__ = !0,
                o
            }
            ,
            this.citationTypes = {
                "mixed-citation": !0,
                "element-citation": !0
            },
            this.refList = function(t, e) {
                for (var n = e.querySelectorAll("ref"), i = 0; i < n.length; i++)
                    this.ref(t, n[i])
            }
            ,
            this.ref = function(t, e) {
                for (var n = o.dom.getChildren(e), i = 0; i < n.length; i++) {
                    var r = n[i]
                      , s = o.dom.getNodeType(r);
                    this.citationTypes[s] ? this.citation(t, e, r) : "label" === s || console.error("Not supported in 'ref': ", s)
                }
            }
            ,
            this.citation = function(t, e, n) {
                var i, o, r = t.doc, s = t.nextId("article_citation"), a = n.querySelector("person-group");
                if (a) {
                    i = {
                        id: s,
                        source_id: e.getAttribute("id"),
                        type: "citation",
                        title: "N/A",
                        label: "",
                        authors: [],
                        doi: "",
                        source: "",
                        volume: "",
                        fpage: "",
                        lpage: "",
                        citation_urls: []
                    };
                    var c = a.querySelectorAll("name");
                    for (o = 0; o < c.length; o++)
                        i.authors.push(this.getName(c[o]));
                    var l = a.querySelectorAll("collab");
                    for (o = 0; o < l.length; o++)
                        i.authors.push(l[o].textContent);
                    var u = n.querySelector("source");
                    u && (i.source = u.textContent);
                    var p = n.querySelector("article-title");
                    if (p)
                        i.title = this.annotatedText(t, p, [s, "title"]);
                    else {
                        var h = n.querySelector("comment");
                        h ? i.title = this.annotatedText(t, h, [s, "title"]) : u ? i.title = this.annotatedText(t, u, [s, "title"]) : console.error("FIXME: this citation has no title", n)
                    }
                    var d = n.querySelector("volume");
                    d && (i.volume = d.textContent);
                    var f = n.querySelector("publisher-loc");
                    f && (i.publisher_location = f.textContent);
                    var g = n.querySelector("publisher-name");
                    g && (i.publisher_name = g.textContent);
                    var y = n.querySelector("fpage");
                    y && (i.fpage = y.textContent);
                    var m = n.querySelector("lpage");
                    m && (i.lpage = m.textContent);
                    var v = n.querySelector("year");
                    v && (i.year = v.textContent);
                    var b = e.querySelector("label");
                    b && (i.label = b.textContent);
                    var w = n.querySelector("pub-id[pub-id-type='doi'], ext-link[ext-link-type='doi']");
                    return w && (i.doi = "http://dx.doi.org/" + w.textContent),
                    r.create(i),
                    r.show("citations", s),
                    i
                }
                console.error("FIXME: there is one of those 'mixed-citation' without any structure. Skipping ...", n)
            }
            ,
            this.back = function(t, e) {
                var n = e.querySelectorAll("app-group");
                n && n.length > 0 ? i.each(n, function(e) {
                    this.appGroup(t, e)
                }
                .bind(this)) : this.appGroup(t, e)
            }
            ,
            this.appGroup = function(t, e) {
                var n = e.querySelectorAll("app")
                  , o = t.doc
                  , r = e.querySelector("title");
                r || console.error("FIXME: every app should have a title", this.toHtml(r));
                var s = t.nextId("heading")
                  , a = o.create({
                    type: "heading",
                    id: s,
                    level: 1,
                    content: "Appendices"
                });
                this.show(t, [a]),
                i.each(n, function(e) {
                    t.sectionLevel = 2,
                    this.app(t, e)
                }
                .bind(this))
            }
            ,
            this.app = function(t, e) {
                var n = t.doc
                  , r = []
                  , s = e.querySelector("title");
                s || console.error("FIXME: every app should have a title", this.toHtml(s));
                var a = t.nextId("heading")
                  , c = {
                    type: "heading",
                    id: a,
                    level: 2,
                    content: s ? this.annotatedText(t, s, [a, "content"]) : ""
                }
                  , l = n.create(c);
                r.push(l);
                var u = this.bodyNodes(t, o.dom.getChildren(e), {
                    ignore: ["title", "label", "ref-list"]
                });
                i.each(u, function(t) {
                    r.push(t)
                }),
                this.show(t, r)
            }
            ,
            this.createAnnotation = function(t, e, n, o) {
                if (n !== o) {
                    var r = e.tagName.toLowerCase()
                      , s = {
                        type: "annotation",
                        path: i.last(t.stack).path,
                        range: [n, o]
                    };
                    this.addAnnotationData(t, s, e, r),
                    this.enhanceAnnotationData(t, s, e, r),
                    s.id = t.nextId(s.type),
                    t.annotations.push(s)
                }
            }
            ,
            this.addAnnotationData = function(t, e, n, i) {
                if (e.type = this._annotationTypes[i] || "annotation",
                "xref" === i)
                    this.addAnnotationDataForXref(t, e, n);
                else if ("ext-link" === i || "uri" === i) {
                    e.url = n.getAttribute("xlink:href");
                    var o = n.getAttribute("ext-link-type") || "";
                    "uri" !== i && "uri" !== o.toLowerCase() || /^\w+:\/\//.exec(e.url) || /^\//.exec(e.url) ? "doi" === o.toLowerCase() && (e.url = ["http://dx.doi.org/", e.url].join("")) : e.url = "http://" + e.url
                } else if ("email" === i)
                    e.url = "mailto:" + n.textContent.trim();
                else if ("inline-graphic" === i)
                    e.url = n.getAttribute("xlink:href");
                else if ("inline-formula" === i) {
                    var r = this.formula(t, n, "inline");
                    e.target = r.id
                } else
                    "custom_annotation" === e.type && (e.name = i)
            }
            ,
            this.addAnnotationDataForXref = function(t, e, n) {
                var i = n.getAttribute("ref-type")
                  , o = n.getAttribute("rid");
                e.type = this._refTypeMapping[i] || "cross_reference",
                o && (e.target = o)
            }
            ,
            this.createInlineNode = function(t, e, n) {
                var o = {
                    type: "inline-node",
                    path: i.last(t.stack).path,
                    range: [n, n + 1]
                };
                this.addInlineNodeData(t, o, e),
                this.enhanceInlineNodeData(t, o, e),
                o.id = t.nextId(o.type),
                t.annotations.push(o)
            }
            ,
            this.addInlineNodeData = function(t, e, n) {
                switch (n.tagName.toLowerCase()) {
                case "fn":
                    var i = this.footnote(t, n);
                    e.type = "footnote_reference",
                    e.target = i.id,
                    e.generated = !0
                }
            }
            ,
            this.enhanceInlineNodeData = function(t, e, n, i) {}
            ,
            this.annotatedText = function(t, e, n, i) {
                i = i || {},
                t.stack.push({
                    path: n,
                    ignore: i.ignore
                });
                var r = new o.dom.ChildNodeIterator(e)
                  , s = this._annotatedText(t, r, i);
                return t.stack.pop(),
                s
            }
            ,
            this._annotatedText = function(t, e, n) {
                for (var i = "", r = void 0 === n.offset ? 0 : n.offset, s = !!n.nested, a = !!n.breakOnUnknown; e.hasNext(); ) {
                    var c = e.next();
                    if (c.nodeType === Node.TEXT_NODE) {
                        var l = t.acceptText(c.textContent);
                        i += l,
                        r += l.length
                    } else {
                        var u, p = o.dom.getNodeType(c);
                        if (this.isAnnotation(p)) {
                            if (t.top().ignore.indexOf(p) < 0) {
                                var h = r;
                                i += u = this._annotationTextHandler[p] ? this._annotationTextHandler[p].call(this, t, c, p, r) : this._getAnnotationText(t, c, p, r),
                                r += u.length,
                                t.ignoreAnnotations || this.createAnnotation(t, c, h, r)
                            }
                        } else if (this.isInlineNode(p))
                            i += " ",
                            this.createInlineNode(t, c, r);
                        else if (a) {
                            if (!s) {
                                e.back();
                                break
                            }
                            console.error("Node not supported in annoted text: " + p + "\n" + c.outerHTML)
                        } else
                            t.top().ignore.indexOf(p) < 0 && (i += u = this._getAnnotationText(t, c, p, r),
                            r += u.length)
                    }
                }
                return i
            }
            ,
            this._annotationTextHandler = {},
            this._getAnnotationText = function(t, e, n, i) {
                var r = new o.dom.ChildNodeIterator(e);
                return this._annotatedText(t, r, {
                    offset: i,
                    nested: !0
                })
            }
            ,
            this._annotationTextHandler["ext-link"] = function(t, e, n, i) {
                var o = this._getAnnotationText(t, e, i);
                return "ext-link" === n && e.getAttribute("xlink:href") === o.trim() && (o = this.shortenLinkLabel(t, o)),
                o
            }
            ,
            this._annotationTextHandler["inline-formula"] = function(t) {
                return t.acceptText("{{inline-formula}}")
            }
            ,
            this.shortenLinkLabel = function(t, e) {
                if (e.length > 50) {
                    var n = /((?:\w+:\/\/)?[\/]?[^\/]+[\/]?)(.*)/.exec(e);
                    if (n) {
                        var i = n[1] || ""
                          , o = n[2] || "";
                        if (i.length > 40)
                            e = i.substring(0, 40) + "..." + o.substring(o.length - 10 - 3);
                        else {
                            var r = Math.max(50 - i.length - 3, 7);
                            e = i + "..." + o.substring(o.length - r)
                        }
                    } else
                        e = e.substring(0, 40) + "..." + e.substring(e.length - 10 - 3)
                }
                return e
            }
            ,
            this.getBaseURL = function(t) {
                return t.xmlDoc.querySelector("article").getAttribute("xml:base") || t.options.baseURL
            }
            ,
            this.enhanceArticle = function(t, e) {}
            ,
            this.enhanceCover = function(t, e, n) {}
            ,
            this.enhanceFigure = function(t, e, n) {
                var i = n.querySelector("graphic").getAttribute("xlink:href");
                e.url = this.resolveURL(t, i)
            }
            ,
            this.enhancePublicationInfo = function(t, e, n) {}
            ,
            this.enhanceSupplement = function(t, e, n) {}
            ,
            this.enhanceTable = function(t, e, n) {}
            ,
            this.enhanceVideo = function(t, e, n) {
                var i, o = n.getAttribute("xlink:href");
                if (o.match(/http:/)) {
                    var r = o.lastIndexOf(".");
                    return i = o.substring(0, r),
                    e.url = i + ".mp4",
                    e.url_ogv = i + ".ogv",
                    e.url_webm = i + ".webm",
                    void (e.poster = i + ".png")
                }
                var s = this.getBaseURL(t);
                i = o.split(".")[0],
                e.url = s + i + ".mp4",
                e.url_ogv = s + i + ".ogv",
                e.url_webm = s + i + ".webm",
                e.poster = s + i + ".png"
            }
            ,
            this.resolveURL = function(t, e) {
                return e.match(/http:/) ? e : [t.options.baseURL, e].join("")
            }
            ,
            this.viewMapping = {
                box: "content",
                supplement: "figures",
                figure: "figures",
                html_table: "figures",
                video: "figures"
            },
            this.enhanceAnnotationData = function(t, e, n, i) {}
            ,
            this.showNode = function(t, e) {
                var n = this.viewMapping[e.type] || "content";
                t.doc.show(n, e.id)
            }
        }
        ,
        a.State = function(t, e, n) {
            var o = this;
            this.xmlDoc = e,
            this.doc = n,
            this.options = t.options,
            this.annotations = [],
            this.stack = [],
            this.sectionLevel = 0,
            this.affiliations = [];
            var r = {};
            this.nextId = function(t) {
                return r[t] = r[t] || 0,
                r[t]++,
                t + "_" + r[t]
            }
            ,
            this.used = {};
            var s = /^\s+/g
              , a = /^\s*/g
              , c = /\s+$/g
              , l = /\s+/g
              , u = /[\t\n\r]+/g;
            this.lastChar = "",
            this.skipWS = !1,
            this.acceptText = function(t) {
                return this.options.TRIM_WHITESPACES ? (t = t.replace(u, ""),
                t = " " === this.lastChar || this.skipWS ? t.replace(a, "") : t.replace(s, " "),
                this.skipWS = !1,
                t = t.replace(c, " "),
                this.options.REMOVE_INNER_WS && (t = t.replace(l, " ")),
                this.lastChar = t[t.length - 1] || this.lastChar,
                t) : t
            }
            ,
            this.top = function() {
                var t = i.last(o.stack);
                return (t = t || {}).ignore = t.ignore || [],
                t
            }
        }
        ,
        a.prototype = new a.Prototype,
        a.prototype.constructor = a,
        a.DefaultOptions = {
            TRIM_WHITESPACES: !0,
            REMOVE_INNER_WS: !0
        },
        e.exports = a
    }
    , {
        "../article": 5,
        "../substance/util": 180,
        underscore: 183
    }],
    129: [function(t, e, n) {
        var i = t("./panels/container_panel")
          , o = new i({
            type: "resource",
            name: "figures",
            container: "figures",
            title: "Gráficos",
            icon: "fa-picture-o",
            references: ["figure_reference"],
            zoom: !0
        })
          , r = new i({
            type: "resource",
            name: "citations",
            container: "citations",
            title: "Referencias",
            icon: "fa-link",
            references: ["citation_reference"]
        })
          , s = new i({
            type: "resource",
            name: "definitions",
            container: "definitions",
            title: "Glossary",
            icon: "fa-book",
            references: ["definition_reference"]
        })
          , a = new i({
            type: "resource",
            name: "info",
            container: "info",
            title: "Información",
            icon: "fa-info",
            references: ["contributor_reference"]
        });
        e.exports = [o, r, s, a]
    }
    , {
        "./panels/container_panel": 136
    }],
    130: [function(t, e, n) {
        var i = t("./workflows/toggle_resource_reference")
          , o = t("./workflows/follow_crossrefs")
          , r = t("./workflows/jump_to_top")
          , s = [new i, new o, new r];
        e.exports = s
    }
    , {
        "./workflows/follow_crossrefs": 152,
        "./workflows/jump_to_top": 153,
        "./workflows/toggle_resource_reference": 154
    }],
    131: [function(t, e, n) {
        e.exports = t("./lens")
    }
    , {
        "./lens": 132
    }],
    132: [function(t, e, n) {
        "use strict";
        var i = t("./lens_controller")
          , o = t("../converter")
          , r = t("../substance/application")
          , s = t("../article")
          , a = t("./panels/resource_panel_viewfactory")
          , c = t("./reader_controller")
          , l = t("./reader_view")
          , u = t("./panels/panel")
          , p = t("./panels/panel_controller")
          , h = t("./panels/panel_view")
          , d = t("./panels/container_panel")
          , f = t("./panels/container_panel_controller")
          , g = t("./panels/container_panel_view")
          , y = t("./workflows/workflow")
          , m = t("./default_panels")
          , v = t("./default_workflows")
          , b = function(t) {
            (t = t || {}).routes = t.routes || this.getRoutes(),
            t.panels = t.panels || this.getPanels(),
            t.workflows = t.workflows || this.getWorkflows(),
            t.converters = this.getConverters(t.converterOptions),
            r.call(this, t),
            this.controller = t.controller || this.createController(t)
        };
        (b.Prototype = function() {
            this.start = function() {
                r.prototype.start.call(this)
            }
            ,
            this.render = function() {
                this.view = this.controller.createView(),
                this.$el.html(this.view.render().el)
            }
            ,
            this.getRoutes = function() {
                return b.getDefaultRoutes()
            }
            ,
            this.getPanels = function() {
                return b.getDefaultPanels()
            }
            ,
            this.getWorkflows = function() {
                return b.getDefaultWorkflows()
            }
            ,
            this.getConverters = function(t) {
                return [b.getDefaultConverter(t)]
            }
            ,
            this.createController = function(t) {
                return new i(t)
            }
        }
        ).prototype = r.prototype,
        (b.prototype = new b.Prototype).constructor = b,
        b.DEFAULT_ROUTES = [{
            route: ":context/:focussedNode/:fullscreen",
            name: "document-focussed-fullscreen",
            command: "openReader"
        }, {
            route: ":context/:focussedNode",
            name: "document-focussed",
            command: "openReader"
        }, {
            route: ":context",
            name: "document-context",
            command: "openReader"
        }, {
            route: "url/:url",
            name: "document",
            command: "openReader"
        }, {
            route: "",
            name: "document",
            command: "openReader"
        }],
        b.getDefaultRoutes = function() {
            return b.DEFAULT_ROUTES
        }
        ,
        b.getDefaultPanels = function() {
            return m.slice(0)
        }
        ,
        b.getDefaultWorkflows = function() {
            return v.slice(0)
        }
        ,
        b.getDefaultConverter = function(t) {
            return new o(t)
        }
        ,
        b.Article = s,
        b.ReaderController = c,
        b.ReaderView = l,
        b.Controller = i,
        b.LensController = i,
        b.Panel = u,
        b.PanelController = p,
        b.PanelView = h,
        b.ContainerPanel = d,
        b.ContainerPanelController = f,
        b.ContainerPanelView = g,
        b.ResourcePanelViewFactory = a,
        b.Workflow = y,
        e.exports = b
    }
    , {
        "../article": 5,
        "../converter": 127,
        "../substance/application": 158,
        "./default_panels": 129,
        "./default_workflows": 130,
        "./lens_controller": 133,
        "./panels/container_panel": 136,
        "./panels/container_panel_controller": 137,
        "./panels/container_panel_view": 138,
        "./panels/panel": 145,
        "./panels/panel_controller": 146,
        "./panels/panel_view": 147,
        "./panels/resource_panel_viewfactory": 148,
        "./reader_controller": 150,
        "./reader_view": 151,
        "./workflows/workflow": 155
    }],
    133: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../substance/util")
          , r = t("../substance/application").Controller
          , s = t("./lens_view")
          , a = t("./reader_controller")
          , c = t("../article")
          , l = t("../converter")
          , u = function(t) {
            r.call(this),
            this.config = t,
            this.Article = t.articleClass || c,
            this.converter = t.converter,
            this.converters = t.converters,
            this.converterOptions = i.extend({}, l.DefaultOptions, t.converterOptions),
            this.on("open:reader", this.openReader)
        };
        (u.Prototype = function() {
            this.createView = function() {
                var t = new s(this);
                return this.view = t,
                t
            }
            ,
            this.importXML = function(t) {
                var e = (new DOMParser).parseFromString(t, "text/xml")
                  , n = this.convertDocument(e);
                this.createReader(n, {
                    panel: "toc"
                })
            }
            ,
            this.updatePath = function(t) {
                var e = [];
                e.push(t.panel),
                t.focussedNode && e.push(t.focussedNode),
                t.fullscreen && e.push("fullscreen"),
                window.app.router.navigate(e.join("/"), {
                    trigger: !1,
                    replace: !1
                })
            }
            ,
            this.createReader = function(t, e) {
                var n = this;
                this.reader = new a(t,e,this.config),
                this.reader.on("state-changed", function() {
                    n.updatePath(n.reader.state)
                }),
                this.modifyState({
                    context: "reader"
                })
            }
            ,
            this.convertDocument = function(t) {
                for (var e, n = 0; !e && n < this.converters.length; ) {
                    var i = this.converters[n];
                    i.test(t, this.config.document_url) && (e = i.import(t)),
                    n += 1
                }
                if (!e)
                    throw new Error("No suitable converter found for this document",t);
                return e
            }
            ,
            this.openReader = function(t, e, n) {
                var i = this
                  , o = {
                    panel: t || "toc",
                    focussedNode: e,
                    fullscreen: !!n
                };
                if (this.reader)
                    this.reader.modifyState(o);
                else if ("lens_article.xml" === this.config.document_url) {
                    var r = this.Article.describe();
                    i.createReader(r, o)
                } else
                    this.trigger("loading:started", "Loading article"),
                    $.get(this.config.document_url).done(function(t) {
                        var e;
                        $.isXMLDoc(t) ? e = i.convertDocument(t) : ("string" == typeof t && (t = $.parseJSON(t)),
                        e = i.Article.fromSnapshot(t)),
                        "toc" === o.panel && e.getHeadings().length <= 2 && (o.panel = "info"),
                        i.createReader(e, o)
                    }).fail(function(t) {
                        i.view.startLoading("Error during loading. Please try again."),
                        console.error(t)
                    })
            }
        }
        ).prototype = r.prototype,
        u.prototype = new u.Prototype,
        i.extend(u.prototype, o.Events),
        e.exports = u
    }
    , {
        "../article": 5,
        "../converter": 127,
        "../substance/application": 158,
        "../substance/util": 180,
        "./lens_view": 135,
        "./reader_controller": 150,
        underscore: 183
    }],
    134: [function(t, e, n) {
        var i = t("underscore")
          , o = t("../substance/application").View
          , r = function(t, e) {
            o.call(this, e),
            this.docCtrl = t,
            this.options = e,
            this.document = t.getDocument(),
            this.options.viewFactory ? this.viewFactory = this.options.viewFactory : this.viewFactory = new this.document.constructor.ViewFactory(this.document.nodeTypes),
            this.$el.addClass("surface"),
            this.$nodes = $("<div>").addClass("nodes"),
            this.$el.append(this.$nodes)
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.$nodes.html(this.build()),
                this
            }
            ,
            this.findNodeView = function(t) {
                return this.el.querySelector("*[data-id=" + t + "]")
            }
            ,
            this.build = function() {
                var t = document.createDocumentFragment();
                i.each(this.nodes, function(t) {
                    t.dispose()
                }),
                this.nodes = {};
                var e = this.docCtrl.container.getTopLevelNodes();
                return i.each(e, function(e) {
                    var n = this.renderNodeView(e);
                    this.nodes[e.id] = n,
                    t.appendChild(n.el)
                }, this),
                t
            }
            ,
            this.renderNodeView = function(t) {
                var e = this.viewFactory.createView(t, {
                    topLevel: !0
                });
                return e.render(),
                e
            }
        }
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        e.exports = r
    }
    , {
        "../substance/application": 158,
        underscore: 183
    }],
    135: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../substance/application").View
          , r = t("../substance/application").$$
          , s = function(t) {
            o.call(this),
            this.controller = t,
            this.$el.attr({
                id: "container"
            }),
            this.listenTo(this.controller, "state-changed", this.onStateChanged),
            this.listenTo(this.controller, "loading:started", this.startLoading),
            $(document).on("dragover", function() {
                return !1
            }),
            $(document).on("ondragend", function() {
                return !1
            }),
            $(document).on("drop", this.handleDroppedFile.bind(this))
        };
        (s.Prototype = function() {
            this.handleDroppedFile = function() {
                var t = this.controller
                  , e = event.dataTransfer.files[0]
                  , n = new FileReader;
                return n.onload = function(e) {
                    t.importXML(e.target.result)
                }
                ,
                n.readAsText(e),
                !1
            }
            ,
            this.onStateChanged = function() {
                var t = this.controller.state;
                "reader" === t.context ? this.openReader() : console.log("Unknown application state: " + t)
            }
            ,
            this.startLoading = function(t) {
                t || (t = "Loading article"),
                $(".spinner-wrapper .message").html(t),
                $("body").addClass("loading")
            }
            ,
            this.stopLoading = function() {
                $("body").removeClass("loading")
            }
            ,
            this.openReader = function() {
                var t = this.controller.reader.createView()
                  , e = this;
                e.replaceMainView("reader", t),
                e.startLoading("Typesetting"),
                this.$("#main").css({
                    opacity: 0
                }),
                i.delay(function() {
                    e.stopLoading(),
                    e.$("#main").css({
                        opacity: 1
                    })
                }, 1e3)
            }
            ,
            this.replaceMainView = function(t, e) {
                $("body").removeClass().addClass("current-view " + t),
                this.mainView && this.mainView !== e && this.mainView.dispose(),
                this.mainView = e,
                this.$("#main").html(e.render().el)
            }
            ,
            this.render = function() {
                return this.el.innerHTML = "",
                this.el.appendChild(r(".browser-not-supported", {
                    text: "Sorry, your browser is not supported.",
                    style: "display: none;"
                })),
                this.el.appendChild(r(".spinner-wrapper", {
                    children: [r(".spinner"), r(".message", {
                        html: "Loading article"
                    })]
                })),
                this.el.appendChild(r("#main")),
                this
            }
            ,
            this.dispose = function() {
                this.stopListening(),
                this.mainView && this.mainView.dispose()
            }
        }
        ).prototype = o.prototype,
        s.prototype = new s.Prototype,
        e.exports = s
    }
    , {
        "../substance/application": 158,
        underscore: 183
    }],
    136: [function(t, e, n) {
        "use strict";
        var i = t("./panel")
          , o = t("./container_panel_controller")
          , r = function(t) {
            i.call(this, t)
        };
        (r.Prototype = function() {
            this.createController = function(t) {
                return new o(t,this.config)
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "./container_panel_controller": 137,
        "./panel": 145
    }],
    137: [function(t, e, n) {
        "use strict";
        var i = t("../../substance/document")
          , o = t("./panel_controller")
          , r = t("./resource_panel_viewfactory")
          , s = t("./container_panel_view")
          , a = function(t, e) {
            o.call(this, t, e),
            this.docCtrl = new i.Controller(t,{
                view: e.container
            })
        };
        (a.Prototype = function() {
            this.createView = function() {
                var t, e = this.getDocument();
                "resource" === this.config.type ? t = this.config.createViewFactory ? this.config.createViewFactory(e, this.config) : new r(e.nodeTypes,this.config) : t = new (0,
                e.constructor.ViewFactory)(e.nodeTypes,this.config);
                return this.viewFactory = t,
                new s(this,t,this.config)
            }
            ,
            this.getContainer = function() {
                return this.docCtrl.getContainer()
            }
        }
        ).prototype = o.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../../substance/document": 171,
        "./container_panel_view": 138,
        "./panel_controller": 146,
        "./resource_panel_viewfactory": 148
    }],
    138: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("./surface_scrollbar")
          , r = t("../lens_surface")
          , s = t("./panel_view")
          , a = t("../../substance/util/getRelativeBoundingRect")
          , c = function(t, e, n) {
            s.call(this, t, n),
            this.surface = new r(t.docCtrl,{
                editable: !1,
                viewFactory: e
            }),
            this.docCtrl = t.docCtrl,
            this.scrollbar = new o(this.surface),
            this._onScroll = i.bind(this.onScroll, this),
            this.surface.$el.on("scroll", this._onScroll),
            this.surface.$el.addClass("resource-view").addClass(n.container),
            this.el.appendChild(this.surface.el),
            this.el.appendChild(this.scrollbar.el),
            this.$activeResource = null
        };
        (c.Prototype = function() {
            this.render = function() {
                return 0 === this.getContainer().getLength() ? (this.hideToggle(),
                this.hide()) : (this.surface.render(),
                this.scrollbar.render()),
                this
            }
            ,
            this.getContainer = function() {
                return this.docCtrl.container
            }
            ,
            this.onScroll = function() {
                this.scrollbar.onScroll()
            }
            ,
            this.hasScrollbar = function() {
                return !0
            }
            ,
            this.scrollTo = function(t) {
                var e = this.findNodeView(t);
                if (e) {
                    var n = this.surface.$el.height()
                      , i = this.surface.$el.scrollTop()
                      , o = i + n
                      , r = a([e], this.surface.$nodes[0])
                      , s = (r.height,
                    r.top)
                      , c = s + r.height;
                    if (s >= i && c <= o)
                        return;
                    this.surface.$el.scrollTop(s),
                    this.scrollbar.update()
                } else
                    console.info("ContainerPanelView.scrollTo(): Unknown resource '%s'", t)
            }
            ,
            this.findNodeView = function(t) {
                return this.surface.findNodeView(t)
            }
            ,
            this.addHighlight = function(t, e) {
                s.prototype.addHighlight.call(this, t, e);
                var n = this.getDocument().get(t);
                n && this.scrollbar.addHighlight(t, e + " " + n.type)
            }
            ,
            this.removeHighlights = function() {
                s.prototype.removeHighlights.call(this),
                this.scrollbar.removeHighlights(),
                this.scrollbar.update()
            }
            ,
            this.update = function() {
                this.scrollbar.update()
            }
            ,
            this.hide = function() {
                this.hidden || s.prototype.hide.call(this)
            }
            ,
            this.show = function() {
                this.scrollbar.update(),
                s.prototype.show.call(this)
            }
        }
        ).prototype = s.prototype,
        (c.prototype = new c.Prototype).constructor = c,
        e.exports = c
    }
    , {
        "../../substance/util/getRelativeBoundingRect": 178,
        "../lens_surface": 134,
        "./panel_view": 147,
        "./surface_scrollbar": 149,
        underscore: 183
    }],
    139: [function(t, e, n) {
        "use strict";
        var i = t("../container_panel")
          , o = t("./content_panel_controller")
          , r = function() {
            i.call(this, {
                name: "content",
                type: "document",
                container: "content",
                label: "Contents",
                title: "Contenido",
                icon: "fa-align-left"
            })
        };
        (r.Prototype = function() {
            this.createController = function(t) {
                return new o(t,this.config)
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../container_panel": 136,
        "./content_panel_controller": 140
    }],
    140: [function(t, e, n) {
        "use strict";
        var i = t("../container_panel_controller")
          , o = t("./content_panel_view")
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.createView = function() {
                if (!this.view) {
                    var t = this.getDocument()
                      , e = new (0,
                    t.constructor.ViewFactory)(t.nodeTypes,this.config);
                    this.view = new o(this,e,this.config)
                }
                return this.view
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../container_panel_controller": 137,
        "./content_panel_view": 141
    }],
    141: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../container_panel_view")
          , r = t("./toc_panel_view")
          , s = function(t, e, n) {
            o.call(this, t, e, n),
            this.tocView = new r(t,e,i.extend({}, n, {
                type: "resource",
                name: "toc"
            })),
            this.tocNodeElements = {},
            this._onTocItemSelected = i.bind(this.onTocItemSelected, this),
            this.resources = t.getDocument().addIndex("referenceByTarget", {
                types: ["resource_reference"],
                property: "target"
            }),
            this.tocView.toc.on("toc-item-selected", this._onTocItemSelected),
            this.$el.addClass("document")
        };
        (s.Prototype = function() {
            this.dispose = function() {
                this.tocView.toc.off("toc-item-selected", this._onTocItemSelected),
                this.stopListening()
            }
            ,
            this.getTocView = function() {
                return this.tocView
            }
            ,
            this.onScroll = function() {
                var t = this.surface.$el.scrollTop();
                this.scrollbar.update(),
                this.markActiveHeading(t)
            }
            ,
            this.onTocItemSelected = function(t) {
                var e = this.findNodeView(t);
                e && e.scrollIntoView()
            }
            ,
            this.markActiveHeading = function(t) {
                var e = $(".nodes").height()
                  , n = this.getDocument().getTocNodes()
                  , o = function(t) {
                    var e = this.tocNodeElements[t];
                    return e || (e = this.tocNodeElements[t] = this.findNodeView(t)),
                    e
                }
                .bind(this);
                if (0 !== n.length) {
                    var r;
                    o(n[0].id);
                    if (r = n[0].id,
                    t + this.$el.height() >= e)
                        r = i.last(n).id;
                    else
                        for (var s = n.length - 1; s >= 1; s--) {
                            var a = n[s]
                              , c = o(a.id);
                            if (c) {
                                if ($(c).offset().top - 1 <= 0) {
                                    r = c.dataset.id;
                                    break
                                }
                            } else
                                console.error("Could not find element for node %s", a.id)
                        }
                    this.tocView.setActiveNode(r)
                }
            }
            ,
            this.markReferencesTo = function(t) {
                var e = this.resources.get(t);
                i.each(e, function(t) {
                    $(this.findNodeView(t.id)).addClass("active")
                }, this)
            }
            ,
            this.removeHighlights = function() {
                o.prototype.removeHighlights.call(this),
                this.$el.find(".content-node.active").removeClass("active"),
                this.$el.find(".annotation.active").removeClass("active")
            }
        }
        ).prototype = o.prototype,
        (s.prototype = new s.Prototype).constructor = s,
        e.exports = s
    }
    , {
        "../container_panel_view": 138,
        "./toc_panel_view": 143,
        underscore: 183
    }],
    142: [function(t, e, n) {
        e.exports = t("./content_panel")
    }
    , {
        "./content_panel": 139
    }],
    143: [function(t, e, n) {
        "use strict";
        var i = t("./toc_view")
          , o = t("../panel_view")
          , r = function(t, e, n) {
            o.call(this, t, n),
            this.toc = new i(t.getDocument(),e)
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.el.appendChild(this.toc.render().el),
                this
            }
            ,
            this.setActiveNode = function(t) {
                this.toc.setActiveNode(t)
            }
            ,
            this.onToggle = function(t) {
                this.trigger("toggle", "toc"),
                t.preventDefault(),
                t.stopPropagation()
            }
        }
        ).prototype = o.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        e.exports = r
    }
    , {
        "../panel_view": 147,
        "./toc_view": 144
    }],
    144: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/application").View
          , o = (t("../../../substance/application").$$,
        t("../../../substance/data").Graph.Index,
        t("underscore"))
          , r = function(t, e) {
            i.call(this),
            this.doc = t,
            this.viewFactory = e,
            this.$el.addClass("toc")
        };
        (r.Prototype = function() {
            this.render = function() {
                var t = -1
                  , e = this.doc.getTocNodes();
                return e.length < 2 ? this : (o.each(e, function(e) {
                    var n = this.viewFactory.createView(e)
                      , i = e.getLevel();
                    -1 === i ? i = t + 1 : t = i;
                    var r = n.renderTocItem()
                      , s = $(r);
                    r.id = "toc_" + e.id,
                    s.addClass("heading-ref"),
                    s.addClass("level-" + i),
                    s.click(o.bind(this.onClick, this, e.id)),
                    this.el.appendChild(r)
                }, this),
                this)
            }
            ,
            this.setActiveNode = function(t) {
                this.$(".heading-ref.active").removeClass("active"),
                this.$("#toc_" + t).addClass("active")
            }
            ,
            this.onClick = function(t) {
                this.trigger("toc-item-selected", t)
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../../../substance/application": 158,
        "../../../substance/data": 164,
        underscore: 183
    }],
    145: [function(t, e, n) {
        "use strict";
        var i = function(t) {
            this.config = t,
            this.config.label = t.title
        };
        i.Prototype = function() {
            this.createController = function(t) {
                throw new Error("this method is abstract")
            }
            ,
            this.getName = function() {
                return this.config.name
            }
            ,
            this.getConfig = function() {
                return this.config
            }
        }
        ,
        (i.prototype = new i.Prototype).constructor = i,
        e.exports = i
    }
    , {}],
    146: [function(t, e, n) {
        "use strict";
        var i = t("../../substance/application").Controller
          , o = (t("underscore"),
        t("../../substance/util"),
        function(t, e) {
            this.document = t,
            this.config = e
        }
        );
        (o.Prototype = function() {
            i.prototype;
            this.createView = function() {
                throw new Error("this is an abstract method")
            }
            ,
            this.getConfig = function() {
                return this.config
            }
            ,
            this.getName = function() {
                return this.config.name
            }
            ,
            this.getDocument = function() {
                return this.document
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../../substance/application": 158,
        "../../substance/util": 180,
        underscore: 183
    }],
    147: [function(t, e, n) {
        var i = t("underscore")
          , o = t("../../substance/application")
          , r = o.$$
          , s = o.View
          , a = function(t, e) {
            s.call(this),
            this.controller = t,
            this.config = e,
            this.doc = t.getDocument(),
            this.name = e.name,
            this.toggleEl = r("a.context-toggle." + this.name, {
                href: "#",
                title: this.config.title,
                html: '<i class="fa ' + this.config.icon + '"></i> ' + this.config.title
            }),
            this.$toggleEl = $(this.toggleEl),
            this.$el.addClass("panel").addClass(this.name),
            "resource" === this.config.type && this.$el.addClass("resource-view"),
            this._onToggle = i.bind(this.onToggle, this),
            this._onToggleResource = i.bind(this.onToggleResource, this),
            this._onToggleResourceReference = i.bind(this.onToggleResourceReference, this),
            this._onToggleFullscreen = i.bind(this.onToggleFullscreen, this),
            this.$toggleEl.click(this._onToggle),
            this.$el.on("click", ".action-toggle-resource", this._onToggleResource),
            this.$el.on("click", ".toggle-fullscreen", this._onToggleFullscreen),
            this.$el.on("click", ".annotation.resource-reference", this._onToggleResourceReference),
            this.highlightedNodes = []
        };
        (a.Prototype = function() {
            this.dispose = function() {
                this.$toggleEl.off("click", this._onClick),
                this.$el.off("scroll", this._onScroll),
                this.$el.off("click", ".a.action-toggle-resource", this._onToggleResource),
                this.$el.off("click", ".a.toggle-fullscreen", this._onToggleFullscreen),
                this.$el.off("click", ".annotation.reference", this._onToggleResourceReference),
                this.stopListening()
            }
            ,
            this.onToggle = function(t) {
                this.trigger("toggle", this.name),
                t.preventDefault(),
                t.stopPropagation()
            }
            ,
            this.getToggleControl = function() {
                return this.toggleEl
            }
            ,
            this.hasScrollbar = function() {
                return !1
            }
            ,
            this.show = function() {
                this.$el.removeClass("hidden"),
                this.hidden = !1
            }
            ,
            this.hide = function() {
                this.hidden || (this.$el.addClass("hidden"),
                this.$toggleEl.removeClass("active"),
                this.hidden = !0)
            }
            ,
            this.isHidden = function() {
                return this.hidden
            }
            ,
            this.activate = function() {
                this.show(),
                $("#main .article")[0].dataset.context = this.name,
                this.$toggleEl.addClass("active")
            }
            ,
            this.addHighlight = function(t, e) {
                var n = this.findNodeView(t);
                if (n) {
                    var i = $(n);
                    i.addClass(e),
                    this.highlightedNodes.push({
                        $el: i,
                        cssClass: e
                    })
                }
            }
            ,
            this.removeHighlights = function() {
                for (var t = 0; t < this.highlightedNodes.length; t++) {
                    var e = this.highlightedNodes[t];
                    e.$el.removeClass(e.cssClass)
                }
                this.highlightedNodes = []
            }
            ,
            this.showToggle = function() {
                this.$toggleEl.removeClass("hidden")
            }
            ,
            this.hideToggle = function() {
                this.$toggleEl.addClass("hidden")
            }
            ,
            this.getDocument = function() {
                return this.doc
            }
            ,
            this.findNodeView = function(t) {
                return this.el.querySelector("*[data-id=" + t + "]")
            }
            ,
            this.onToggleResource = function(t) {
                t.preventDefault(),
                t.stopPropagation();
                var e = $(t.currentTarget).parents(".content-node")[0]
                  , n = e.dataset.id;
                this.trigger("toggle-resource", this.name, n, e)
            }
            ,
            this.onToggleResourceReference = function(t) {
                t.preventDefault(),
                t.stopPropagation();
                var e = t.currentTarget
                  , n = t.currentTarget.dataset.id;
                this.trigger("toggle-resource-reference", this.name, n, e)
            }
            ,
            this.onToggleFullscreen = function(t) {
                t.preventDefault(),
                t.stopPropagation();
                var e = $(t.currentTarget).parents(".content-node")[0]
                  , n = e.dataset.id;
                this.trigger("toggle-fullscreen", this.name, n, e)
            }
        }
        ).prototype = s.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        e.exports = a
    }
    , {
        "../../substance/application": 158,
        underscore: 183
    }],
    148: [function(t, e, n) {
        var i = t("../../article").ViewFactory
          , o = function(t, e) {
            i.call(this, t),
            this.options = e || {},
            void 0 === this.options.header && (this.options.header = !0),
            void 0 === this.options.zoom && (this.options.zoom = o.enableZoom)
        };
        o.Prototype = function() {
            this.createView = function(t, e, n) {
                e = e || {};
                var i = this.getNodeViewClass(t, n);
                return e.topLevel && i.prototype.isResourceView && this.options.header && (e.header = !0,
                i.prototype.isZoomable && this.options.zoom && (e.zoom = !0)),
                new i(t,this,e)
            }
        }
        ,
        o.Prototype.prototype = i.prototype,
        o.prototype = new o.Prototype,
        o.enableZoom = !1,
        e.exports = o
    }
    , {
        "../../article": 5
    }],
    149: [function(t, e, n) {
        "use strict";
        var i = t("../../substance/application").View
          , o = t("../../substance/application").$$
          , r = t("underscore")
          , s = function(t) {
            i.call(this),
            this.surface = t,
            this.$nodes = this.surface.$nodes,
            this.$el.addClass("surface-scrollbar"),
            this.$el.addClass(t.docCtrl.getContainer().id),
            this.overlays = [],
            r.bindAll(this, "mouseDown", "mouseUp", "mouseMove", "updateVisibleArea"),
            this.$el.mousedown(this.mouseDown),
            $(window).mousemove(this.mouseMove),
            $(window).mouseup(this.mouseUp)
        };
        (s.Prototype = function() {
            this.render = function() {
                var t = this.$nodes.height()
                  , e = this.surface.$el.height();
                return this.factor = t / e,
                this.visibleArea = o(".visible-area"),
                this.scrollTop = this.surface.$el.scrollTop(),
                this.el.innerHTML = "",
                this.el.appendChild(this.visibleArea),
                this.updateVisibleArea(),
                this
            }
            ,
            this.updateVisibleArea = function() {
                $(this.visibleArea).css({
                    top: this.scrollTop / this.factor,
                    height: this.surface.$el.height() / this.factor
                })
            }
            ,
            this.addOverlay = function(t) {
                var e = $("<div>").addClass("node overlay");
                return this.overlays.push({
                    el: t,
                    $overlay: e
                }),
                this.$el.append(e),
                e
            }
            ,
            this.updateOverlay = function(t, e) {
                var n = $(t)
                  , i = n.outerHeight(!0) / this.factor
                  , o = (n.offset().top - this.surfaceTop) / this.factor;
                i < s.OverlayMinHeight && (i = s.OverlayMinHeight,
                o -= .5 * s.OverlayMinHeight),
                e.css({
                    height: i,
                    top: o
                })
            }
            ,
            this.addHighlight = function(t, e) {
                var n = this.surface.findNodeView(t);
                if (n) {
                    var i = this.addOverlay(n);
                    return this.updateOverlay(n, i),
                    i.addClass(e),
                    i[0]
                }
            }
            ,
            this.addHighlights = function(t, e) {
                for (var n = [], i = 0; i < t.length; i++) {
                    var o = this.addHighlight(t[i], e);
                    n.push(o)
                }
                return this.update(),
                n
            }
            ,
            this.removeHighlights = function() {
                for (var t = 0; t < this.overlays.length; t++) {
                    this.overlays[t].$overlay.remove()
                }
            }
            ,
            this.update = function() {
                var t = this.$nodes.height()
                  , e = this.surface.$el.height();
                t > e ? $(this.el).removeClass("hidden") : $(this.el).addClass("hidden"),
                this.factor = t / e,
                this.surfaceTop = this.$nodes.offset().top,
                this.scrollTop = this.surface.$el.scrollTop(),
                this.updateVisibleArea();
                for (var n = 0; n < this.overlays.length; n++) {
                    var i = this.overlays[n];
                    this.updateOverlay(i.el, i.$overlay)
                }
            }
            ,
            this.mouseDown = function(t) {
                this._mouseDown = !0;
                var e = t.pageY;
                return t.target !== this.visibleArea ? (this.offset = $(this.visibleArea).height() / 2,
                this.mouseMove(t)) : this.offset = e - $(this.visibleArea).position().top,
                !1
            }
            ,
            this.mouseUp = function() {
                this._mouseDown = !1
            }
            ,
            this.mouseMove = function(t) {
                if (this._mouseDown) {
                    var e = (t.pageY - this.offset) * this.factor;
                    this.scrollTop = this.surface.$el.scrollTop(e),
                    this.updateVisibleArea()
                }
            }
            ,
            this.onScroll = function() {
                this.surface && (this.scrollTop = this.surface.$el.scrollTop(),
                this.updateVisibleArea())
            }
        }
        ).prototype = i.prototype,
        s.prototype = new s.Prototype,
        s.OverlayMinHeight = 5,
        e.exports = s
    }
    , {
        "../../substance/application": 158,
        underscore: 183
    }],
    150: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../substance/application").Controller
          , r = t("./reader_view")
          , s = t("./panels/content")
          , a = function(t, e, n) {
            this.__document = t,
            this.options = n || {},
            this.panels = n.panels,
            this.contentPanel = new s(t),
            this.panelCtrls = {},
            this.panelCtrls.content = this.contentPanel.createController(t),
            i.each(this.panels, function(e) {
                this.panelCtrls[e.getName()] = e.createController(t)
            }, this),
            this.workflows = n.workflows || [],
            this.state = e,
            this.currentPanel = "toc"
        };
        (a.Prototype = function() {
            this.createView = function() {
                return this.view || (this.view = new r(this)),
                this.view
            }
            ,
            this.switchPanel = function(t) {
                this.currentPanel = t,
                this.modifyState({
                    panel: t,
                    focussedNode: null,
                    fullscreen: !1
                })
            }
            ,
            this.getDocument = function() {
                return this.__document
            }
        }
        ).prototype = o.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../substance/application": 158,
        "./panels/content": 142,
        "./reader_view": 151,
        underscore: 183
    }],
    151: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../substance/application").View
          , r = t("../substance/data").Graph.Index
          , s = t("../substance/application").$$
          , a = function(t) {
            o.call(this),
            this.readerCtrl = t,
            this.doc = this.readerCtrl.getDocument(),
            this.$el.addClass("article"),
            this.$el.addClass(this.doc.schema.id),
            this.bodyScroll = {},
            this.contentView = t.panelCtrls.content.createView(),
            this.tocView = this.contentView.getTocView(),
            this.panelViews = {},
            this.panelForRef = {},
            i.each(t.panels, function(e) {
                var n = e.getName()
                  , o = t.panelCtrls[n];
                this.panelViews[n] = o.createView(),
                i.each(e.config.references, function(t) {
                    this.panelForRef[t] = n
                }, this)
            }, this),
            this.panelViews.toc = this.tocView,
            this.resources = new r(this.readerCtrl.getDocument(),{
                types: ["resource_reference"],
                property: "target"
            }),
            this.lastWorkflow = null,
            this.lastPanel = "toc",
            this._onTogglePanel = i.bind(this.switchPanel, this),
            this.listenTo(this.readerCtrl, "state-changed", this.updateState),
            this.listenTo(this.tocView, "toggle", this._onTogglePanel),
            i.each(this.panelViews, function(t) {
                this.listenTo(t, "toggle", this._onTogglePanel),
                this.listenTo(t, "toggle-resource", this.onToggleResource),
                this.listenTo(t, "toggle-resource-reference", this.onToggleResourceReference),
                this.listenTo(t, "toggle-fullscreen", this.onToggleFullscreen)
            }, this),
            this.listenTo(this.contentView, "toggle", this._onTogglePanel),
            this.listenTo(this.contentView, "toggle-resource", this.onToggleResource),
            this.listenTo(this.contentView, "toggle-resource-reference", this.onToggleResourceReference),
            this.listenTo(this.contentView, "toggle-fullscreen", this.onToggleFullscreen),
            i.each(this.readerCtrl.workflows, function(t) {
                t.attach(this.readerCtrl, this)
            }, this),
            $(window).resize(i.debounce(i.bind(function() {
                this.contentView.scrollbar.update();
                var t = this.panelViews[this.readerCtrl.state.panel];
                t && t.hasScrollbar() && t.scrollbar.update()
            }, this), 1))
        };
        (a.Prototype = function() {
            this.render = function() {
                var t = document.createDocumentFragment();
                t.appendChild(this.contentView.render().el);
                var e = s(".scrollbar-cover");
                this.contentView.el.appendChild(e);
                var n = s(".context-toggles");
                n.appendChild(this.tocView.getToggleControl()),
                this.tocView.on("toggle", this._onClickPanel),
                i.each(this.readerCtrl.panels, function(t) {
                    var e = this.panelViews[t.getName()]
                      , i = e.getToggleControl();
                    n.appendChild(i),
                    e.on("toggle", this._onClickPanel)
                }, this);
                var o = s(".resources");
                o.appendChild(this.tocView.render().el),
                i.each(this.readerCtrl.panels, function(t) {
                    var e = this.panelViews[t.getName()];
                    o.appendChild(e.render().el)
                }, this);
                var r = s(".menu-bar");
                return r.appendChild(n),
                o.appendChild(r),
                t.appendChild(o),
                this.el.appendChild(t),
                i.delay(i.bind(function() {
                    this.updateState();
                    var t = this;
                    window.MathJax && void 0 !== window.MathJax.Hub && (window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]),
                    window.MathJax.Hub.Queue(function() {
                        t.updateState()
                    }))
                }, this), 1),
                this
            }
            ,
            this.dispose = function() {
                i.each(this.workflows, function(t) {
                    t.detach()
                }),
                this.contentView.dispose(),
                i.each(this.panelViews, function(t) {
                    t.off("toggle", this._onClickPanel),
                    t.dispose()
                }, this),
                this.resources.dispose(),
                this.stopListening()
            }
            ,
            this.getState = function() {
                return this.readerCtrl.state
            }
            ,
            this.switchPanel = function(t) {
                this.readerCtrl.switchPanel(t),
                this.lastPanel = t
            }
            ,
            this.updateState = function() {
                var t, e = this, n = this.readerCtrl.state, o = {
                    focussedNode: n.focussedNode ? this.doc.get(n.focussedNode) : null
                }, r = "content" === n.panel ? this.contentView : this.panelViews[n.panel];
                if (i.each(this.panelViews, function(t) {
                    t.isHidden() || t.hide()
                }),
                this.contentView.removeHighlights(),
                i.each(this.panelViews, function(t) {
                    t.removeHighlights()
                }),
                n.focussedNode) {
                    var s = ["focussed", "highlighted"];
                    n.fullscreen && s.push("fullscreen"),
                    this.contentView.addHighlight(n.focussedNode, s.concat("main-occurrence").join(" ")),
                    r.addHighlight(n.focussedNode, s.join(" ")),
                    r.scrollTo(n.focussedNode)
                }
                if (this.lastWorkflow && (t = this.lastWorkflow.handleStateUpdate(n, o)),
                !t)
                    for (var a = 0; a < this.readerCtrl.workflows.length; a++) {
                        var c = this.readerCtrl.workflows[a];
                        if (c !== this.lastWorkflow && c.handlesStateUpdate && (t = c.handleStateUpdate(n, o))) {
                            this.lastWorkflow = c;
                            break
                        }
                    }
                if (!t)
                    if ("content" !== n.panel) {
                        var l = this.panelViews[n.panel];
                        if (this.showPanel(n.panel),
                        n.focussedNode) {
                            var u = this.resources.get(n.focussedNode);
                            i.each(u, function(t) {
                                this.contentView.addHighlight(t.id, "highlighted ")
                            }, this),
                            l.hasScrollbar() && l.scrollTo(n.focussedNode)
                        }
                    } else
                        this.showPanel("toc");
                e.updateScrollbars(),
                i.delay(function() {
                    e.updateScrollbars()
                }, 2e3)
            }
            ,
            this.updateScrollbars = function() {
                this.readerCtrl.state;
                this.contentView.scrollbar.update(),
                i.each(this.panelViews, function(t) {
                    t.hasScrollbar() && t.scrollbar.update()
                })
            }
            ,
            this.showPanel = function(t) {
                this.panelViews[t] ? (this.panelViews[t].activate(),
                this.el.dataset.context = t) : "content" === t && (this.panelViews.toc.activate(),
                this.el.dataset.context = t)
            }
            ,
            this.getPanelView = function(t) {
                return this.panelViews[t]
            }
            ,
            this.onToggleResource = function(t, e, n) {
                n.classList.contains("highlighted") ? this.readerCtrl.modifyState({
                    panel: t,
                    focussedNode: null,
                    fullscreen: !1
                }) : this.readerCtrl.modifyState({
                    panel: t,
                    focussedNode: e
                })
            }
            ,
            this.onToggleResourceReference = function(t, e, n) {
                n.classList.contains("highlighted") ? this.readerCtrl.modifyState({
                    panel: this.lastPanel,
                    focussedNode: null,
                    fullscreen: !1
                }) : this.readerCtrl.modifyState({
                    panel: "content",
                    focussedNode: e,
                    fullscreen: !1
                })
            }
            ,
            this.onToggleFullscreen = function(t, e) {
                var n = !this.readerCtrl.state.fullscreen;
                this.readerCtrl.modifyState({
                    panel: t,
                    focussedNode: e,
                    fullscreen: n
                })
            }
        }
        ).prototype = o.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        e.exports = a
    }
    , {
        "../substance/application": 158,
        "../substance/data": 164,
        underscore: 183
    }],
    152: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("./workflow")
          , r = function() {
            o.apply(this, arguments),
            this._followCrossReference = i.bind(this.followCrossReference, this)
        };
        (r.Prototype = function() {
            this.registerHandlers = function() {
                this.readerView.$el.on("click", ".annotation.cross_reference", this._followCrossReference)
            }
            ,
            this.unRegisterHandlers = function() {
                this.readerView.$el.off("click", ".annotation.cross_reference", this._followCrossReference)
            }
            ,
            this.followCrossReference = function(t) {
                t.preventDefault(),
                t.stopPropagation();
                var e = t.currentTarget.dataset.id
                  , n = this.readerCtrl.getDocument().get(e);
                this.readerView.contentView.scrollTo(n.target)
            }
        }
        ).prototype = o.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "./workflow": 155,
        underscore: 183
    }],
    153: [function(t, n, i) {
        "use strict";
        var o = t("underscore")
          , r = t("./workflow")
          , s = function() {
            r.apply(this, arguments),
            this._gotoTop = o.bind(this.gotoTop, this)
        };
        (s.Prototype = function() {
            this.registerHandlers = function() {
                this.readerView.$el.on("click", ".document .content-node.heading .top", this._gotoTop)
            }
            ,
            this.unRegisterHandlers = function() {
                this.readerView.$el.off("click", ".document .content-node.heading .top", this._gotoTop)
            }
            ,
            this.gotoTop = function() {
                e.preventDefault(),
                e.stopPropagation(),
                this.readerCtrl.contentView.jumpToNode("cover")
            }
        }
        ).prototype = r.prototype,
        s.prototype = new s.Prototype,
        n.exports = s
    }
    , {
        "./workflow": 155,
        underscore: 183
    }],
    154: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("./workflow")
          , r = function() {
            o.apply(this, arguments)
        };
        (r.Prototype = function() {
            this.registerHandlers = function() {}
            ,
            this.unRegisterHandlers = function() {}
            ,
            this.handlesStateUpdate = !0,
            this.handleStateUpdate = function(t, e) {
                if (e.focussedNode && this.readerView.panelForRef[e.focussedNode.type]) {
                    var n = e.focussedNode
                      , o = this.readerView.panelForRef[n.type]
                      , r = this.readerView.panelViews[o]
                      , s = this.readerView.contentView
                      , a = n.target;
                    r.activate();
                    r.addHighlight(a, ["highlighted"].join(" ")),
                    r.scrollTo(a);
                    var c = this.readerView.resources.get(a);
                    return delete c[n.id],
                    i.each(c, function(t) {
                        s.addHighlight(t.id, "highlighted")
                    }, this),
                    !0
                }
                return !1
            }
        }
        ).prototype = o.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "./workflow": 155,
        underscore: 183
    }],
    155: [function(t, e, n) {
        "use strict";
        var i = function() {
            this.readerController = null,
            this.readerView = null
        };
        i.Prototype = function() {
            this.attach = function(t, e) {
                this.readerCtrl = t,
                this.readerView = e,
                this.registerHandlers()
            }
            ,
            this.detach = function() {
                this.unRegisterHandlers(),
                this.readerView = null,
                this.readerController = null
            }
            ,
            this.registerHandlers = function() {
                throw new Error("This method is abstract")
            }
            ,
            this.unRegisterHandlers = function() {
                throw new Error("This method is abstract")
            }
            ,
            this.handlesStateUpdate = !1,
            this.handleStateUpdate = function(t, e) {
                throw new Error("This method is abstract")
            }
        }
        ,
        i.prototype = new i.Prototype,
        e.exports = i
    }
    , {}],
    156: [function(t, e, n) {
        "use strict";
        var i = t("./view")
          , o = t("./router")
          , r = (t("../../substance/util"),
        t("underscore"))
          , s = function(t) {
            i.call(this),
            this.config = t
        };
        (s.Prototype = function() {
            this.initRouter = function() {
                this.router = new o,
                r.each(this.config.routes, function(t) {
                    this.router.route(t.route, t.name, r.bind(this.controller[t.command], this.controller))
                }, this),
                o.history.start()
            }
            ,
            this.start = function() {
                this.$el = $("body"),
                this.el = this.$el[0],
                this.render(),
                this.initRouter()
            }
        }
        ).prototype = i.prototype,
        s.prototype = new s.Prototype,
        e.exports = s
    }
    , {
        "../../substance/util": 180,
        "./router": 160,
        "./view": 161,
        underscore: 183
    }],
    157: [function(t, e, n) {
        "use strict";
        var i = t("../../substance/util")
          , o = t("underscore")
          , r = function(t) {
            this.state = {},
            this.context = null
        };
        (r.Prototype = function() {
            this.updateState = function(t, e) {
                console.error("updateState is deprecated, use modifyState. State is now a rich object where context replaces the old state variable");
                var n = this.context;
                this.context = t,
                this.state = e,
                this.trigger("state-changed", this.context, n, e)
            }
            ,
            this.modifyState = function(t) {
                var e = this.state.context;
                o.extend(this.state, t),
                t.context && t.context !== e && this.trigger("context-changed", t.context),
                this.trigger("state-changed", this.state.context)
            }
        }
        ).prototype = i.Events,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../../substance/util": 180,
        underscore: 183
    }],
    158: [function(t, e, n) {
        "use strict";
        var i = t("./application");
        i.View = t("./view"),
        i.Router = t("./router"),
        i.Controller = t("./controller"),
        i.ElementRenderer = t("./renderers/element_renderer"),
        i.$$ = i.ElementRenderer.$$,
        e.exports = i
    }
    , {
        "./application": 156,
        "./controller": 157,
        "./renderers/element_renderer": 159,
        "./router": 160,
        "./view": 161
    }],
    159: [function(t, e, n) {
        "use strict";
        var i = t("../../../substance/util")
          , o = i.RegExp
          , r = function(t) {
            return this.attributes = t,
            this.tagName = t.tag,
            this.children = t.children || [],
            this.text = t.text || "",
            this.html = t.html,
            delete t.children,
            delete t.text,
            delete t.html,
            delete t.tag,
            this.render()
        };
        r.Prototype = function() {
            this.render = function() {
                var t = document.createElement(this.tagName);
                for (var e in this.html ? t.innerHTML = this.html : t.textContent = this.text,
                this.attributes) {
                    var n = this.attributes[e];
                    t.setAttribute(e, n)
                }
                for (var i = 0; i < this.children.length; i++) {
                    var o = this.children[i];
                    t.appendChild(o)
                }
                return this.el = t,
                t
            }
        }
        ;
        r.$$ = function(t, e) {
            e = e || {};
            var n = /^([a-zA-Z0-9]*)/.exec(t);
            e.tag = n && n[1] ? n[1] : "div";
            var i = /#([a-zA-Z0-9_]*)/.exec(t);
            i && i[1] && (e.id = i[1]);
            var s = new o(/\.([a-zA-Z0-9_-]*)/g);
            return e.class || (e.class = s.match(t).map(function(t) {
                return t.match[1]
            }).join(" ")),
            new r(e)
        }
        ,
        r.Prototype.prototype = i.Events,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../../../substance/util": 180
    }],
    160: [function(t, e, n) {
        "use strict";
        var i = t("../../substance/util")
          , o = t("underscore")
          , r = function(t) {
            t || (t = {}),
            t.routes && (this.routes = t.routes),
            this._bindRoutes(),
            this.initialize.apply(this, arguments)
        }
          , s = /\((.*?)\)/g
          , a = /(\(\?)?:\w+/g
          , c = /\*\w+/g
          , l = /[\-{}\[\]+?.,\\\^$|#\s]/g;
        o.extend(r.prototype, i.Events, {
            initialize: function() {},
            route: function(t, e, n) {
                o.isRegExp(t) || (t = this._routeToRegExp(t)),
                o.isFunction(e) && (n = e,
                e = ""),
                n || (n = this[e]);
                var i = this;
                return r.history.route(t, function(o) {
                    var s = i._extractParameters(t, o);
                    n && n.apply(i, s),
                    i.trigger.apply(i, ["route:" + e].concat(s)),
                    i.trigger("route", e, s),
                    r.history.trigger("route", i, e, s)
                }),
                this
            },
            navigate: function(t, e) {
                return r.history.navigate(t, e),
                this
            },
            _bindRoutes: function() {
                if (this.routes) {
                    this.routes = o.result(this, "routes");
                    for (var t, e = o.keys(this.routes); null != (t = e.pop()); )
                        this.route(t, this.routes[t])
                }
            },
            _routeToRegExp: function(t) {
                return t = t.replace(l, "\\$&").replace(s, "(?:$1)?").replace(a, function(t, e) {
                    return e ? t : "([^/]+)"
                }).replace(c, "(.*?)"),
                new RegExp("^" + t + "$")
            },
            _extractParameters: function(t, e) {
                var n = t.exec(e).slice(1);
                return o.map(n, function(t) {
                    return t ? decodeURIComponent(t) : null
                })
            }
        });
        var u = r.History = function() {
            this.handlers = [],
            o.bindAll(this, "checkUrl"),
            "undefined" != typeof window && (this.location = window.location,
            this.history = window.history)
        }
          , p = /^[#\/]|\s+$/g
          , h = /^\/+|\/+$/g
          , d = /msie [\w.]+/
          , f = /\/$/;
        u.started = !1,
        o.extend(u.prototype, i.Events, {
            interval: 50,
            getHash: function(t) {
                var e = (t || this).location.href.match(/#(.*)$/);
                return e ? e[1] : ""
            },
            getFragment: function(t, e) {
                if (null == t)
                    if (this._hasPushState || !this._wantsHashChange || e) {
                        t = this.location.pathname;
                        var n = this.root.replace(f, "");
                        t.indexOf(n) || (t = t.substr(n.length))
                    } else
                        t = this.getHash();
                return t.replace(p, "")
            },
            start: function(t) {
                if (u.started)
                    throw new Error("Router.history has already been started");
                u.started = !0,
                this.options = o.extend({}, {
                    root: "/"
                }, this.options, t),
                this.root = this.options.root,
                this._wantsHashChange = !1 !== this.options.hashChange,
                this._wantsPushState = !!this.options.pushState,
                this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
                var e = this.getFragment()
                  , n = document.documentMode
                  , i = d.exec(navigator.userAgent.toLowerCase()) && (!n || n <= 7);
                this.root = ("/" + this.root + "/").replace(h, "/"),
                i && this._wantsHashChange && (this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,
                this.navigate(e)),
                this._hasPushState ? $(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange"in window && !i ? $(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)),
                this.fragment = e;
                var r = this.location
                  , s = r.pathname.replace(/[^\/]$/, "$&/") === this.root;
                return this._wantsHashChange && this._wantsPushState && !this._hasPushState && !s ? (this.fragment = this.getFragment(null, !0),
                this.location.replace(this.root + this.location.search + "#" + this.fragment),
                !0) : (this._wantsPushState && this._hasPushState && s && r.hash && (this.fragment = this.getHash().replace(p, ""),
                this.history.replaceState({}, document.title, this.root + this.fragment + r.search)),
                this.options.silent ? void 0 : this.loadUrl())
            },
            stop: function() {
                $(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl),
                clearInterval(this._checkUrlInterval),
                u.started = !1
            },
            route: function(t, e) {
                this.handlers.unshift({
                    route: t,
                    callback: e
                })
            },
            checkUrl: function(t) {
                var e = this.getFragment();
                if (e === this.fragment && this.iframe && (e = this.getFragment(this.getHash(this.iframe))),
                e === this.fragment)
                    return !1;
                this.iframe && this.navigate(e),
                this.loadUrl() || this.loadUrl(this.getHash())
            },
            loadUrl: function(t) {
                var e = this.fragment = this.getFragment(t);
                return o.any(this.handlers, function(t) {
                    if (t.route.test(e))
                        return t.callback(e),
                        !0
                })
            },
            navigate: function(t, e) {
                if (!u.started)
                    return !1;
                if (e && !0 !== e || (e = {
                    trigger: e
                }),
                t = this.getFragment(t || ""),
                this.fragment !== t) {
                    this.fragment = t;
                    var n = this.root + t;
                    if (this._hasPushState)
                        this.history[e.replace ? "replaceState" : "pushState"]({}, document.title, n);
                    else {
                        if (!this._wantsHashChange)
                            return this.location.assign(n);
                        this._updateHash(this.location, t, e.replace),
                        this.iframe && t !== this.getFragment(this.getHash(this.iframe)) && (e.replace || this.iframe.document.open().close(),
                        this._updateHash(this.iframe.location, t, e.replace))
                    }
                    e.trigger && this.loadUrl(t)
                }
            },
            _updateHash: function(t, e, n) {
                if (n) {
                    var i = t.href.replace(/(javascript:|#).*$/, "");
                    t.replace(i + "#" + e)
                } else
                    t.hash = "#" + e
            }
        }),
        r.history = new u,
        e.exports = r
    }
    , {
        "../../substance/util": 180,
        underscore: 183
    }],
    161: [function(t, e, n) {
        "use strict";
        var i = t("../../substance/util")
          , o = function(t) {
            t = t || {};
            this.el = t.el || window.document.createElement(t.elementType || "div"),
            this.$el = $(this.el),
            this.dispatchDOMEvents()
        };
        (o.Prototype = function() {
            this.$ = function(t) {
                return this.$el.find(t)
            }
            ,
            this.render = function() {
                return this
            }
            ,
            this.dispatchDOMEvents = function() {
                var t = this;
                this.$el.delegate("[sbs-click]", "click", function(e) {
                    console.error("FIXME: sbs-click is deprecated. Use jquery handlers with selectors instead.");
                    var n = function(t) {
                        var e = /(\w+)\((.*)\)/.exec(t);
                        if (!e)
                            throw new Error("Invalid click handler '" + t + "'");
                        return {
                            method: e[1],
                            args: e[2].split(",")
                        }
                    }($(e.currentTarget).attr("sbs-click"))
                      , i = t[n.method];
                    if (i)
                        return e.stopPropagation(),
                        e.preventDefault(),
                        i.apply(t, n.args),
                        !1
                })
            }
        }
        ).prototype = i.Events,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../../substance/util": 180
    }],
    162: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../substance/util")
          , r = o.errors
          , s = t("./schema")
          , a = t("./property")
          , c = t("./graph_index")
          , l = r.define("GraphError")
          , u = ["object", "array", "string", "number", "boolean", "date"]
          , p = function(t) {
            return i.isArray(t) && (t = t[0]),
            u.indexOf(t) >= 0
        }
          , h = function(t, e) {
            if (e = e || {},
            this.schema = new s(t),
            this.schema.id && e.seed && e.seed.schema && !i.isEqual(e.seed.schema, [this.schema.id, this.schema.version]))
                throw new l(["Graph does not conform to schema. Expected: ", this.schema.id + "@" + this.schema.version, " Actual: ", e.seed.schema[0] + "@" + e.seed.schema[1]].join(""));
            this.nodes = {},
            this.indexes = {},
            this.__seed__ = e.seed,
            this.init()
        };
        h.Prototype = function() {
            i.extend(this, o.Events),
            this.create = function(t) {
                this.nodes[t.id] = t,
                this._updateIndexes({
                    type: "create",
                    path: [t.id],
                    val: t
                })
            }
            ,
            this.delete = function(t) {
                var e = this.nodes[t];
                delete this.nodes[t],
                this._updateIndexes({
                    type: "delete",
                    path: [t],
                    val: e
                })
            }
            ,
            this.set = function(t, e) {
                var n = this.resolve(t);
                if (!n)
                    throw new l("Could not resolve property with path " + JSON.stringify(t));
                var i = n.get();
                n.set(e),
                this._updateIndexes({
                    type: "set",
                    path: t,
                    val: e,
                    original: i
                })
            }
            ,
            this.get = function(t) {
                if (!i.isArray(t) && !i.isString(t))
                    throw new l("Invalid argument path. Must be String or Array");
                return arguments.length > 1 && (t = i.toArray(arguments)),
                i.isString(t) ? this.nodes[t] : this.resolve(t).get()
            }
            ,
            this.query = function(t) {
                var e = this.resolve(t)
                  , n = e.type
                  , i = e.baseType
                  , o = e.get();
                return "array" === i ? this._queryArray.call(this, o, n) : p(i) ? o : this.get(o)
            }
            ,
            this.toJSON = function() {
                return {
                    id: this.id,
                    schema: [this.schema.id, this.schema.version],
                    nodes: o.deepclone(this.nodes)
                }
            }
            ,
            this.contains = function(t) {
                return !!this.nodes[t]
            }
            ,
            this.resolve = function(t) {
                return new a(this,t)
            }
            ,
            this.reset = function() {
                this.init(),
                this.trigger("graph:reset")
            }
            ,
            this.init = function() {
                this.__is_initializing__ = !0,
                this.__seed__ ? this.nodes = o.clone(this.__seed__.nodes) : this.nodes = {},
                i.each(this.indexes, function(t) {
                    t.reset()
                }),
                delete this.__is_initializing__
            }
            ,
            this.addIndex = function(t, e) {
                if (this.indexes[t])
                    throw new l("Index with name " + t + "already exists.");
                var n = new c(this,e);
                return this.indexes[t] = n,
                n
            }
            ,
            this.removeIndex = function(t) {
                delete this.indexes[t]
            }
            ,
            this._updateIndexes = function(t) {
                i.each(this.indexes, function(e) {
                    t ? e.onGraphChange(t) : e.rebuild()
                }, this)
            }
            ,
            this._queryArray = function(t, e) {
                if (!i.isArray(e))
                    throw new l("Illegal argument: array types must be specified as ['array'(, 'array')*, <type>]");
                var n, o;
                if ("array" === e[1])
                    for (n = [],
                    o = 0; o < t.length; o++)
                        n.push(this._queryArray(t[o], e.slice(1)));
                else if (p(e[1]))
                    n = t;
                else
                    for (n = [],
                    o = 0; o < t.length; o++)
                        n.push(this.get(t[o]));
                return n
            }
        }
        ,
        h.DEFAULT_MODE = h.STRICT_INDEXING = 2,
        h.prototype = new h.Prototype,
        h.Schema = s,
        h.Property = a,
        h.Index = c,
        e.exports = h
    }
    , {
        "../../substance/util": 180,
        "./graph_index": 163,
        "./property": 165,
        "./schema": 166,
        underscore: 183
    }],
    163: [function(t, e, n) {
        var i = t("underscore")
          , o = t("../../substance/util")
          , r = function(t, e) {
            e = e || {},
            this.graph = t,
            this.nodes = {},
            this.scopes = {},
            e.filter ? this.filter = e.filter : e.types && (this.filter = r.typeFilter(t.schema, e.types)),
            e.property && (this.property = e.property),
            this.createIndex()
        };
        r.Prototype = function() {
            var t = function(t) {
                var e = this;
                if (null !== t)
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        e.scopes[i] = e.scopes[i] || {
                            nodes: {},
                            scopes: {}
                        },
                        e = e.scopes[i]
                    }
                return e
            }
              , e = function(t) {
                if (!this.property)
                    return null;
                var e = t[this.property] ? t[this.property] : null;
                return i.isString(e) && (e = [e]),
                e
            }
              , n = function(t) {
                var e = i.extend({}, t.nodes);
                return i.each(t.scopes, function(t, o) {
                    "nodes" !== o && i.extend(e, n(t))
                }),
                e
            };
            this.onGraphChange = function(t) {
                this.applyOp(t)
            }
            ,
            this._add = function(n) {
                if (!this.filter || this.filter(n)) {
                    var i = e.call(this, n);
                    t.call(this, i).nodes[n.id] = n.id
                }
            }
            ,
            this._remove = function(n) {
                if (!this.filter || this.filter(n)) {
                    var i = e.call(this, n);
                    delete t.call(this, i).nodes[n.id]
                }
            }
            ,
            this._update = function(e, n, o, r) {
                if (this.property === n && (!this.filter || this.filter(e))) {
                    var s = r;
                    i.isString(s) && (s = [s]);
                    var a = t.call(this, s);
                    delete a.nodes[e.id],
                    s = o,
                    a.nodes[e.id] = e.id
                }
            }
            ,
            this.applyOp = function(t) {
                if ("create" === t.type)
                    this._add(t.val);
                else if ("delete" === t.type)
                    this._remove(t.val);
                else {
                    var e, n = this.graph.resolve(this, t.path), i = n.get();
                    if (void 0 === i)
                        return;
                    "set" === t.type ? e = t.original : console.error("Operational updates are not supported in this implementation"),
                    this._update(n.node, n.key, i, e)
                }
            }
            ,
            this.createIndex = function() {
                this.reset();
                var n = this.graph.nodes;
                i.each(n, function(n) {
                    if (!this.filter || this.filter(n)) {
                        var i = e.call(this, n);
                        t.call(this, i).nodes[n.id] = n.id
                    }
                }, this)
            }
            ,
            this.get = function(e) {
                0 === arguments.length ? e = null : i.isString(e) && (e = [e]);
                var o = t.call(this, e)
                  , s = n(o)
                  , a = new r.Result;
                return i.each(s, function(t) {
                    a[t] = this.graph.get(t)
                }, this),
                a
            }
            ,
            this.reset = function() {
                this.nodes = {},
                this.scopes = {}
            }
            ,
            this.dispose = function() {
                this.stopListening()
            }
            ,
            this.rebuild = function() {
                this.reset(),
                this.createIndex()
            }
        }
        ,
        r.prototype = i.extend(new r.Prototype, o.Events.Listener),
        r.typeFilter = function(t, e) {
            return function(n) {
                for (var i = t.typeChain(n.type), o = 0; o < e.length; o++)
                    if (i.indexOf(e[o]) >= 0)
                        return !0;
                return !1
            }
        }
        ,
        r.Result = function() {}
        ,
        r.Result.prototype.asList = function() {
            var t = [];
            for (var e in this)
                t.push(this[e])
        }
        ,
        r.Result.prototype.getLength = function() {
            return Object.keys(this).length
        }
        ,
        e.exports = r
    }
    , {
        "../../substance/util": 180,
        underscore: 183
    }],
    164: [function(t, e, n) {
        "use strict";
        var i = {
            VERSION: "0.8.0"
        };
        i.Graph = t("./graph"),
        e.exports = i
    }
    , {
        "./graph": 162
    }],
    165: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = function(t, e) {
            if (!e)
                throw new Error("Illegal argument: path is null/undefined.");
            this.graph = t,
            this.schema = t.schema,
            i.extend(this, this.resolve(e))
        };
        o.Prototype = function() {
            this.resolve = function(t) {
                for (var e, n, i = this.graph, o = i, r = "graph", s = 0; s < t.length; s++)
                    if ("graph" === r || void 0 !== this.schema.types[r]) {
                        if (void 0 === (o = this.graph.get(t[s])))
                            return;
                        i = o,
                        r = this.schema.properties(o.type),
                        n = i,
                        e = void 0
                    } else {
                        if (void 0 === o)
                            return;
                        e = t[s];
                        var a = t[s];
                        r = r[a],
                        n = o[e],
                        s < t.length - 1 && (o = o[a])
                    }
                return {
                    node: i,
                    parent: o,
                    type: r,
                    key: e,
                    value: n
                }
            }
            ,
            this.get = function() {
                return void 0 !== this.key ? this.parent[this.key] : this.node
            }
            ,
            this.set = function(t) {
                if (void 0 === this.key)
                    throw new Error("'set' is only supported for node properties.");
                this.parent[this.key] = this.schema.parseValue(this.baseType, t)
            }
        }
        ,
        o.prototype = new o.Prototype,
        Object.defineProperties(o.prototype, {
            baseType: {
                get: function() {
                    return i.isArray(this.type) ? this.type[0] : this.type
                }
            },
            path: {
                get: function() {
                    return [this.node.id, this.key]
                }
            }
        }),
        e.exports = o
    }
    , {
        underscore: 183
    }],
    166: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../substance/util")
          , r = function(t) {
            i.extend(this, t)
        };
        r.Prototype = function() {
            this.defaultValue = function(t) {
                return "object" === t ? {} : "array" === t ? [] : "string" === t ? "" : "number" === t ? 0 : "boolean" !== t && ("date" === t ? new Date : null)
            }
            ,
            this.parseValue = function(t, e) {
                if (null === e)
                    return e;
                if (i.isString(e)) {
                    if ("object" === t)
                        return JSON.parse(e);
                    if ("array" === t)
                        return JSON.parse(e);
                    if ("string" === t)
                        return e;
                    if ("number" === t)
                        return parseInt(e, 10);
                    if ("boolean" === t) {
                        if ("true" === e)
                            return !0;
                        if ("false" === e)
                            return !1;
                        throw new Error("Can not parse boolean value from: " + e)
                    }
                    return "date" === t ? new Date(e) : e
                }
                if ("array" === t) {
                    if (!i.isArray(e))
                        throw new Error("Illegal value type: expected array.");
                    e = o.deepclone(e)
                } else if ("string" === t) {
                    if (!i.isString(e))
                        throw new Error("Illegal value type: expected string.")
                } else if ("object" === t) {
                    if (!i.isObject(e))
                        throw new Error("Illegal value type: expected object.");
                    e = o.deepclone(e)
                } else if ("number" === t) {
                    if (!i.isNumber(e))
                        throw new Error("Illegal value type: expected number.")
                } else if ("boolean" === t) {
                    if (!i.isBoolean(e))
                        throw new Error("Illegal value type: expected boolean.")
                } else {
                    if ("date" !== t)
                        throw new Error("Unsupported value type: " + t);
                    e = new Date(e)
                }
                return e
            }
            ,
            this.type = function(t) {
                return this.types[t]
            }
            ,
            this.typeChain = function(t) {
                var e = this.types[t];
                if (!e)
                    throw new Error("Type " + t + " not found in schema");
                var n = e.parent ? this.typeChain(e.parent) : [];
                return n.push(t),
                n
            }
            ,
            this.isInstanceOf = function(t, e) {
                var n = this.typeChain(t);
                return !!(n && n.indexOf(e) >= 0)
            }
            ,
            this.baseType = function(t) {
                return this.typeChain(t)[0]
            }
            ,
            this.properties = function(t) {
                var e = (t = i.isObject(t) ? t : this.type(t)).parent ? this.properties(t.parent) : {};
                return i.extend(e, t.properties),
                e
            }
            ,
            this.propertyType = function(t, e) {
                var n = this.properties(t)[e];
                if (!n)
                    throw new Error("Property not found for" + t + "." + e);
                return i.isArray(n) ? n : [n]
            }
            ,
            this.propertyBaseType = function(t, e) {
                return this.propertyType(t, e)[0]
            }
        }
        ,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../../substance/util": 180,
        underscore: 183
    }],
    167: [function(t, e, n) {
        var i = t("./node")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "composite",
            parent: "content",
            properties: {}
        },
        o.description = {
            name: "Composite",
            remarks: ["A file reference to an external resource."],
            properties: {}
        },
        o.example = {
            no_example: "yet"
        },
        (o.Prototype = function() {
            this.getLength = function() {
                throw new Error("Composite.getLength() is abstract.")
            }
            ,
            this.getNodes = function() {
                return this.getChildrenIds()
            }
            ,
            this.getChildrenIds = function() {
                throw new Error("Composite.getChildrenIds() is abstract.")
            }
            ,
            this.isMutable = function() {
                return !1
            }
            ,
            this.insertOperation = function() {
                return null
            }
            ,
            this.deleteOperation = function() {
                return null
            }
            ,
            this.insertChild = function() {
                throw new Error("This composite is immutable.")
            }
            ,
            this.deleteChild = function() {
                throw new Error("This composite is immutable.")
            }
            ,
            this.getChangePosition = function(t) {
                return 0
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "./node": 172
    }],
    168: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../substance/util")
          , r = t("./composite")
          , s = function(t, e) {
            this.document = t,
            this.view = e,
            this.treeView = [],
            this.listView = [],
            this.__parents = {},
            this.__composites = {},
            this.rebuild()
        };
        s.Prototype = function() {
            this.rebuild = function() {
                this.treeView.splice(0, this.treeView.length),
                this.listView.splice(0, this.listView.length),
                this.treeView = i.clone(this.view.nodes);
                for (var t = 0; t < this.view.length; t++)
                    this.treeView.push(this.view[t]);
                this.__parents = {},
                this.__composites = {},
                function(t, e) {
                    var n, i, o, s = [];
                    for (n = this.treeView.length - 1; n >= 0; n--)
                        s.unshift({
                            id: this.treeView[n],
                            parent: null
                        });
                    for (; s.length > 0; ) {
                        if (i = s.shift(),
                        (o = this.document.get(i.id))instanceof r) {
                            var a = o.getNodes();
                            for (n = a.length - 1; n >= 0; n--)
                                s.unshift({
                                    id: a[n],
                                    parent: o.id
                                })
                        }
                        t.call(e, o, i.parent)
                    }
                }
                .call(this, function(t, e) {
                    if (t instanceof r)
                        this.__parents[t.id] = e,
                        this.__composites[e] = e;
                    else {
                        if (this.listView.push(t.id),
                        this.__parents[t.id])
                            throw new Error("Nodes must be unique in one view.");
                        this.__parents[t.id] = e,
                        this.__composites[e] = e
                    }
                }, this)
            }
            ,
            this.getTopLevelNodes = function() {
                return i.map(this.treeView, function(t) {
                    return this.document.get(t)
                }, this)
            }
            ,
            this.getNodes = function(t) {
                var e = this.listView;
                if (t)
                    return i.clone(e);
                for (var n = [], o = 0; o < e.length; o++)
                    n.push(this.document.get(e[o]));
                return n
            }
            ,
            this.getPosition = function(t) {
                return this.listView.indexOf(t)
            }
            ,
            this.getNodeFromPosition = function(t) {
                var e = this.listView[t];
                return void 0 !== e ? this.document.get(e) : null
            }
            ,
            this.getParent = function(t) {
                return this.__parents[t]
            }
            ,
            this.getRoot = function(t) {
                for (var e = t; e; )
                    t = e,
                    e = this.getParent(t);
                return t
            }
            ,
            this.update = function(t) {
                var e = t.path;
                (e[0] === this.view.id || void 0 !== this.__composites[e[0]]) && this.rebuild()
            }
            ,
            this.getLength = function() {
                return this.listView.length
            }
            ,
            this.hasSuccessor = function(t) {
                return t < this.getLength() - 1
            }
            ,
            this.hasPredecessor = function(t) {
                return t > 0
            }
            ,
            this.getPredecessor = function(t) {
                var e = this.getPosition(t);
                return e <= 0 ? null : this.getNodeFromPosition(e - 1)
            }
            ,
            this.getSuccessor = function(t) {
                var e = this.getPosition(t);
                return e >= this.getLength() - 1 ? null : this.getNodeFromPosition(e + 1)
            }
            ,
            this.firstChild = function(t) {
                if (t instanceof r) {
                    var e = this.document.get(t.getNodes()[0]);
                    return this.firstChild(e)
                }
                return t
            }
            ,
            this.lastChild = function(t) {
                if (t instanceof r) {
                    var e = this.document.get(i.last(t.getNodes()));
                    return this.lastChild(e)
                }
                return t
            }
            ,
            this.before = function(t) {
                var e = this.firstChild(t);
                return [this.getPosition(e.id), 0]
            }
            ,
            this.after = function(t) {
                var e = this.lastChild(t);
                return [this.getPosition(e.id), e.getLength()]
            }
        }
        ,
        s.prototype = i.extend(new s.Prototype, o.Events.Listener),
        Object.defineProperties(s.prototype, {
            id: {
                get: function() {
                    return this.view.id
                }
            },
            type: {
                get: function() {
                    return this.view.type
                }
            },
            nodes: {
                get: function() {
                    return this.view.nodes
                },
                set: function(t) {
                    this.view.nodes = t
                }
            }
        }),
        e.exports = s
    }
    , {
        "../../substance/util": 180,
        "./composite": 167,
        underscore: 183
    }],
    169: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../substance/util")
          , r = function(t, e) {
            e = e || {},
            this.view = e.view || "content",
            this.__document = t,
            this.container = t.get(this.view)
        };
        r.Prototype = function() {
            this.getNodes = function(t) {
                return this.container.getNodes(t)
            }
            ,
            this.getContainer = function() {
                return this.container
            }
            ,
            this.getPosition = function(t, e) {
                return this.container.getPosition(t, e)
            }
            ,
            this.getNodeFromPosition = function(t) {
                return this.container.getNodeFromPosition(t)
            }
            ,
            this.getAnnotations = function(t) {
                return (t = t || {}).view = this.view,
                this.annotator.getAnnotations(t)
            }
            ,
            this.get = function() {
                return this.__document.get.apply(this.__document, arguments)
            }
            ,
            this.on = function() {
                return this.__document.on.apply(this.__document, arguments)
            }
            ,
            this.off = function() {
                return this.__document.off.apply(this.__document, arguments)
            }
            ,
            this.getDocument = function() {
                return this.__document
            }
        }
        ,
        r.prototype = i.extend(new r.Prototype, o.Events.Listener),
        Object.defineProperties(r.prototype, {
            id: {
                get: function() {
                    return this.__document.id
                },
                set: function() {
                    throw "immutable property"
                }
            },
            nodeTypes: {
                get: function() {
                    return this.__document.nodeTypes
                },
                set: function() {
                    throw "immutable property"
                }
            },
            title: {
                get: function() {
                    return this.__document.get("document").title
                },
                set: function() {
                    throw "immutable property"
                }
            },
            updated_at: {
                get: function() {
                    return this.__document.get("document").updated_at
                },
                set: function() {
                    throw "immutable property"
                }
            },
            creator: {
                get: function() {
                    return this.__document.get("document").creator
                },
                set: function() {
                    throw "immutable property"
                }
            }
        }),
        e.exports = r
    }
    , {
        "../../substance/util": 180,
        underscore: 183
    }],
    170: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../../substance/util")
          , r = o.errors
          , s = t("../../substance/data")
          , a = t("./container")
          , c = r.define("DocumentError")
          , l = function(t) {
            s.Graph.call(this, t.schema, t),
            this.containers = {},
            this.addIndex("annotations", {
                types: ["annotation"],
                property: "path"
            })
        };
        l.schema = {
            indexes: {},
            types: {
                content: {
                    properties: {}
                },
                view: {
                    properties: {
                        nodes: ["array", "content"]
                    }
                }
            }
        },
        (l.Prototype = function() {
            var t = o.prototype(this);
            this.getIndex = function(t) {
                return this.indexes[t]
            }
            ,
            this.getSchema = function() {
                return this.schema
            }
            ,
            this.create = function(e) {
                return t.create.call(this, e),
                this.get(e.id)
            }
            ,
            this.get = function(e) {
                var n = t.get.call(this, e);
                if (!n)
                    return n;
                if ("view" === n.type)
                    return this.containers[n.id] || (this.containers[n.id] = new a(this,n)),
                    this.containers[n.id];
                var i = this.nodeTypes[n.type]
                  , o = void 0 !== i ? i.Model : null;
                return !o || n instanceof o || (n = new o(n,this),
                this.nodes[n.id] = n),
                n
            }
            ,
            this.toJSON = function() {
                var e = t.toJSON.call(this);
                return e.id = this.id,
                e
            }
            ,
            this.hide = function(t, e) {
                var n = this.get(t);
                if (!n)
                    throw new c("Invalid view id: " + t);
                i.isString(e) && (e = [e]);
                var o = [];
                if (i.each(e, function(t) {
                    var e = n.nodes.indexOf(t);
                    e >= 0 && o.push(e)
                }, this),
                0 !== o.length) {
                    o = o.sort().reverse(),
                    o = i.uniq(o);
                    for (var r = this.nodes[t], s = 0; s < o.length; s++)
                        r.nodes.splice(o[s], 1)
                }
            }
            ,
            this.show = function(t, e, n) {
                void 0 === n && (n = -1);
                var i = this.get(t);
                if (!i)
                    throw new c("Invalid view id: " + t);
                var o = i.nodes.length;
                (n = Math.min(n, o)) < 0 && (n = Math.max(0, o + n + 1)),
                i.nodes.splice(n, 0, e)
            }
            ,
            this.fromSnapshot = function(t, e) {
                return l.fromSnapshot(t, e)
            }
            ,
            this.uuid = function(t) {
                return t + "_" + o.uuid()
            }
        }
        ).prototype = s.Graph.prototype,
        l.prototype = new l.Prototype,
        l.fromSnapshot = function(t, e) {
            return (e = e || {}).seed = t,
            new l(e)
        }
        ,
        l.DocumentError = c,
        e.exports = l
    }
    , {
        "../../substance/data": 164,
        "../../substance/util": 180,
        "./container": 168,
        underscore: 183
    }],
    171: [function(t, e, n) {
        "use strict";
        t("underscore");
        var i = t("./document");
        i.Container = t("./container"),
        i.Controller = t("./controller"),
        i.Node = t("./node"),
        i.Composite = t("./composite"),
        i.TextNode = t("./text_node"),
        e.exports = i
    }
    , {
        "./composite": 167,
        "./container": 168,
        "./controller": 169,
        "./document": 170,
        "./node": 172,
        "./text_node": 173,
        underscore: 183
    }],
    172: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = function(t, e) {
            this.document = e,
            this.properties = t
        };
        o.type = {
            parent: "content",
            properties: {}
        },
        o.properties = {
            abstract: !0,
            immutable: !0,
            mergeableWith: [],
            preventEmpty: !0,
            allowedAnnotations: []
        },
        o.Prototype = function() {
            this.toJSON = function() {
                return i.clone(this.properties)
            }
            ,
            this.getLength = function() {
                throw new Error("Node.getLength() is abstract.")
            }
            ,
            this.getChangePosition = function(t) {
                throw new Error("Node.getCharPosition() is abstract.")
            }
            ,
            this.insertOperation = function(t, e) {
                throw new Error("Node.insertOperation() is abstract.")
            }
            ,
            this.deleteOperation = function(t, e) {
                throw new Error("Node.deleteOperation() is abstract.")
            }
            ,
            this.canJoin = function(t) {
                return !1
            }
            ,
            this.join = function(t) {
                throw new Error("Node.join() is abstract.")
            }
            ,
            this.isBreakable = function() {
                return !1
            }
            ,
            this.break = function(t, e) {
                throw new Error("Node.split() is abstract.")
            }
            ,
            this.getAnnotations = function() {
                return this.document.getIndex("annotations").get(this.properties.id)
            }
            ,
            this.includeInToc = function() {
                return !1
            }
        }
        ,
        (o.prototype = new o.Prototype).constructor = o,
        o.defineProperties = function(t, e, n) {
            var o = t;
            if (1 === arguments.length) {
                var r = t;
                if (!(o = r.prototype) || !r.type)
                    throw new Error("Illegal argument: expected NodeClass");
                e = Object.keys(r.type.properties)
            }
            i.each(e, function(t) {
                var e = {
                    get: function() {
                        return this.properties[t]
                    }
                };
                n || (e.set = function(e) {
                    return this.properties[t] = e,
                    this
                }
                ),
                Object.defineProperty(o, t, e)
            })
        }
        ,
        o.defineProperties(o.prototype, ["id", "type"]),
        e.exports = o
    }
    , {
        underscore: 183
    }],
    173: [function(t, e, n) {
        "use strict";
        var i = t("./node")
          , o = function(t, e) {
            i.call(this, t, e)
        };
        o.type = {
            id: "text",
            parent: "content",
            properties: {
                source_id: "Text element source id",
                content: "string"
            }
        },
        o.description = {
            name: "Text",
            remarks: ["A simple text fragement that can be annotated. Usually text nodes are combined in a paragraph."],
            properties: {
                content: "Content"
            }
        },
        o.example = {
            type: "paragraph",
            id: "paragraph_1",
            content: "Lorem ipsum dolor sit amet, adipiscing elit."
        },
        (o.Prototype = function() {
            this.getLength = function() {
                return this.properties.content.length
            }
        }
        ).prototype = i.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.defineProperties(o.prototype, ["content"]),
        e.exports = o
    }
    , {
        "./node": 172
    }],
    174: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("./util.js")
          , r = {};
        function s(t, e) {
            var n = t.finally || function(t, n) {
                e(t, n)
            }
            ;
            n = i.once(n);
            var r = t.data || {}
              , s = t.functions;
            if (!i.isFunction(e))
                return e("Illegal arguments: a callback function must be provided");
            var a = 0
              , c = void 0 === t.stopOnError || t.stopOnError
              , l = [];
            !function t(e) {
                var r = s[a];
                if (!r)
                    return l.length > 0 ? n(new Error("Multiple errors occurred.",e)) : n(null, e);
                var u = i.once(function(e, i) {
                    if (e) {
                        if (c)
                            return n(e, null);
                        l.push(e)
                    }
                    a += 1,
                    t(i)
                });
                try {
                    0 === r.length ? (r(),
                    u(null, e)) : 1 === r.length ? r(u) : r(e, u)
                } catch (t) {
                    console.log("util.async caught error:", t),
                    o.printStackTrace(t),
                    n(t)
                }
            }(r)
        }
        function a(t) {
            return function(e, n) {
                var o = t.selector ? t.selector(e) : t.items
                  , r = t.finally || function(t, e) {
                    n(t, e)
                }
                ;
                if (r = i.once(r),
                !o)
                    return r(null, e);
                var a = i.isArray(o);
                t.before && t.before(e);
                var c = []
                  , l = t.iterator;
                function u(t, e) {
                    return function(n, i) {
                        2 === l.length ? l(t, i) : 3 === l.length ? l(t, e, i) : l(t, e, n, i)
                    }
                }
                function p(t, e) {
                    return function(n, i) {
                        2 === l.length ? l(t, i) : 3 === l.length ? l(t, e, i) : l(t, e, n, i)
                    }
                }
                if (a)
                    for (var h = 0; h < o.length; h++)
                        c.push(u(o[h], h));
                else
                    for (var d in o)
                        c.push(p(o[d], d));
                s({
                    functions: c,
                    data: e,
                    finally: r,
                    stopOnError: t.stopOnError
                }, n)
            }
        }
        r.sequential = function(t, e) {
            i.isArray(t) && (t = {
                functions: t
            }),
            s(t, e)
        }
        ,
        r.iterator = function(t, e) {
            return a(1 == arguments.length ? t : {
                items: t,
                iterator: e
            })
        }
        ,
        r.each = function(t, e) {
            a(t)(null, e)
        }
        ,
        e.exports = r
    }
    , {
        "./util.js": 182,
        underscore: 183
    }],
    175: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = {
            ChildNodeIterator: function(t) {
                i.isArray(t) ? this.nodes = t : this.nodes = t.childNodes,
                this.length = this.nodes.length,
                this.pos = -1
            }
        };
        o.ChildNodeIterator.prototype = {
            hasNext: function() {
                return this.pos < this.length - 1
            },
            next: function() {
                return this.pos += 1,
                this.nodes[this.pos]
            },
            back: function() {
                return this.pos >= 0 && (this.pos -= 1),
                this
            }
        },
        o.getChildren = function(t) {
            if (void 0 !== t.children)
                return t.children;
            for (var e = [], n = t.firstElementChild; n; )
                e.push(n),
                n = n.nextElementSibling;
            return e
        }
        ,
        o.getNodeType = function(t) {
            return t.nodeType === window.Node.TEXT_NODE ? "text" : t.nodeType === window.Node.COMMENT_NODE ? "comment" : t.tagName ? t.tagName.toLowerCase() : (console.error("Can't get node type for ", t),
            "unknown")
        }
        ,
        e.exports = o
    }
    , {
        underscore: 183
    }],
    176: [function(t, e, n) {
        "use strict";
        var i = t("./util")
          , o = {}
          , r = function(t, e) {
            e ? (Error.call(this, t, e.fileName, e.lineNumber),
            e instanceof r ? this.__stack = e.__stack : e.stack ? this.__stack = i.parseStackTrace(e) : this.__stack = i.callstack(1)) : (Error.call(this, t),
            this.__stack = i.callstack(1)),
            this.message = t
        };
        r.Prototype = function() {
            this.name = "SubstanceError",
            this.code = -1,
            this.toString = function() {
                return this.name + ":" + this.message
            }
            ,
            this.toJSON = function() {
                return {
                    name: this.name,
                    message: this.message,
                    code: this.code,
                    stack: this.stack
                }
            }
            ,
            this.printStackTrace = function() {
                i.printStackTrace(this)
            }
        }
        ,
        r.Prototype.prototype = Error.prototype,
        r.prototype = new r.Prototype,
        Object.defineProperty(r.prototype, "stack", {
            get: function() {
                for (var t = [], e = 0; e < this.__stack.length; e++) {
                    var n = this.__stack[e];
                    t.push(n.file + ":" + n.line + ":" + n.col + " (" + n.func + ")")
                }
                return t.join("\n")
            },
            set: function() {
                throw new Error("SubstanceError.stack is read-only.")
            }
        }),
        o.SubstanceError = r;
        o.define = function(t, e, n) {
            if (!t)
                throw new r("Name is required.");
            void 0 === e && (e = -1);
            var i = function(t, e, n) {
                return function(i) {
                    t.call(this, i),
                    this.name = e,
                    this.code = n
                }
            }(n = n || r, t, e)
              , s = function() {};
            return s.prototype = n.prototype,
            i.prototype = new s,
            i.prototype.constructor = i,
            o[t] = i,
            i
        }
        ,
        e.exports = o
    }
    , {
        "./util": 182
    }],
    177: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = function(t) {
            this.levels = t || {}
        };
        o.Prototype = function() {
            this.onText = function() {}
            ,
            this.onEnter = function() {
                return null
            }
            ,
            this.onExit = function() {}
            ,
            this.enter = function(t, e) {
                return this.onEnter(t, e)
            }
            ,
            this.exit = function(t, e) {
                this.onExit(t, e)
            }
            ,
            this.createText = function(t, e) {
                this.onText(t, e)
            }
            ,
            this.start = function(t, e, n) {
                var o = function(t) {
                    var e = [];
                    return i.each(t, function(t) {
                        var n = this.levels[t.type] || 1e3;
                        void 0 !== n && (e.push({
                            pos: t.range[0],
                            mode: 1,
                            level: n,
                            id: t.id,
                            type: t.type,
                            node: t
                        }),
                        e.push({
                            pos: t.range[1],
                            mode: -1,
                            level: n,
                            id: t.id,
                            type: t.type,
                            node: t
                        }))
                    }, this),
                    e
                }
                .call(this, n);
                o.sort(function(t, e) {
                    if (t.pos < e.pos)
                        return -1;
                    if (t.pos > e.pos)
                        return 1;
                    if (t.mode < e.mode)
                        return -1;
                    if (t.mode > e.mode)
                        return 1;
                    if (1 === t.mode) {
                        if (t.level < e.level)
                            return -1;
                        if (t.level > e.level)
                            return 1
                    }
                    if (-1 === t.mode) {
                        if (t.level > e.level)
                            return -1;
                        if (t.level < e.level)
                            return 1
                    }
                    return 0
                }
                .bind(this));
                for (var r = [{
                    context: t,
                    entry: null
                }], s = 0, a = 0; a < o.length; a++) {
                    var c = o[a];
                    this.createText(r[r.length - 1].context, e.substring(s, c.pos)),
                    s = c.pos;
                    var l, u = 1;
                    if (1 === c.mode) {
                        for (; u < r.length && !(c.level < r[u].entry.level); u++)
                            ;
                        r.splice(u, 0, {
                            entry: c
                        })
                    } else if (-1 === c.mode) {
                        for (; u < r.length && r[u].entry.id !== c.id; u++)
                            ;
                        for (l = u; l < r.length; l++)
                            this.exit(r[l].entry, r[l - 1].context);
                        r.splice(u, 1)
                    }
                    for (l = u; l < r.length; l++)
                        r[l].context = this.enter(r[l].entry, r[l - 1].context)
                }
                this.createText(t, e.substring(s))
            }
        }
        ,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        underscore: 183
    }],
    178: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = i.map
          , r = i.each;
        function s(t) {
            var e = {
                left: Number.POSITIVE_INFINITY,
                top: Number.POSITIVE_INFINITY,
                right: Number.NEGATIVE_INFINITY,
                bottom: Number.NEGATIVE_INFINITY,
                width: Number.NaN,
                height: Number.NaN
            };
            return r(t, function(t) {
                t.left < e.left && (e.left = t.left),
                t.top < e.top && (e.top = t.top),
                t.left + t.width > e.right && (e.right = t.left + t.width),
                t.top + t.height > e.bottom && (e.bottom = t.top + t.height)
            }),
            e.width = e.right - e.left,
            e.height = e.bottom - e.top,
            e
        }
        e.exports = function(t, e) {
            void 0 === t.length && (t = [t]);
            var n = s(o(t, function(t) {
                return function(t, e) {
                    var n = e.getBoundingClientRect()
                      , i = s(t.getClientRects())
                      , o = i.left - n.left
                      , r = i.top - n.top;
                    return {
                        left: o,
                        top: r,
                        right: n.width - o - i.width,
                        bottom: n.height - r - i.height,
                        width: i.width,
                        height: i.height
                    }
                }(t, e)
            }))
              , i = e.getBoundingClientRect();
            return {
                left: n.left,
                top: n.top,
                right: i.width - n.left - n.width,
                bottom: i.height - n.top - n.height,
                width: n.width,
                height: n.height
            }
        }
    }
    , {
        underscore: 183
    }],
    179: [function(t, e, n) {
        "use strict";
        var i = {}
          , o = t("underscore");
        i.templates = {},
        i.renderTemplate = function(t, e) {
            return i.templates[t](e)
        }
        ,
        "undefined" != typeof window && (window.console || (window.console = {
            log: function() {}
        })),
        i.tpl = function(t, e) {
            e = e || {};
            var n = window.$("script[name=" + t + "]").html();
            return o.template(n, e)
        }
        ,
        e.exports = i
    }
    , {
        underscore: 183
    }],
    180: [function(t, e, n) {
        "use strict";
        var i = t("./util");
        i.async = t("./async"),
        i.errors = t("./errors"),
        i.html = t("./html"),
        i.dom = t("./dom"),
        i.RegExp = t("./regexp"),
        i.Fragmenter = t("./fragmenter"),
        e.exports = i
    }
    , {
        "./async": 174,
        "./dom": 175,
        "./errors": 176,
        "./fragmenter": 177,
        "./html": 179,
        "./regexp": 181,
        "./util": 182
    }],
    181: [function(t, e, n) {
        "use strict";
        var i = function(t) {
            this.index = t.index,
            this.match = [];
            for (var e = 0; e < t.length; e++)
                this.match.push(t[e])
        };
        i.Prototype = function() {
            this.captures = function() {
                return this.match.slice(1)
            }
            ,
            this.toString = function() {
                return this.match[0]
            }
        }
        ,
        i.prototype = new i.Prototype;
        var o = function(t) {
            this.exp = t
        };
        o.Prototype = function() {
            this.match = function(t) {
                if (void 0 === t)
                    throw new Error("No string given");
                if (this.exp.global) {
                    var e, n = [];
                    for (this.exp.compile(this.exp); null !== (e = this.exp.exec(t)); )
                        n.push(new i(e));
                    return n
                }
                return this.exp.exec(t)
            }
        }
        ,
        o.prototype = new o.Prototype,
        o.Match = i,
        e.exports = o
    }
    , {}],
    182: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = {
            uuid: function(t, e) {
                var n, i, o = "0123456789abcdefghijklmnopqrstuvwxyz".split(""), r = [];
                if (e = e || 32)
                    for (n = 0; n < e; n++)
                        r[n] = o[0 | 16 * Math.random()];
                else
                    for (r[8] = r[13] = r[18] = r[23] = "-",
                    r[14] = "4",
                    n = 0; n < 36; n++)
                        r[n] || (i = 0 | 16 * Math.random(),
                        r[n] = o[19 == n ? 3 & i | 8 : i]);
                return (t || "") + r.join("")
            },
            uuidGen: function(t) {
                var e = 1;
                return t = void 0 !== t ? t : "uuid_",
                function(n) {
                    return (n = n || t) + e++
                }
            }
        }
          , r = function(t, e) {
            var n, i = -1, o = t.length, r = e[0], s = e[1], a = e[2];
            switch (e.length) {
            case 0:
                for (; ++i < o; )
                    (n = t[i]).callback.call(n.ctx);
                return;
            case 1:
                for (; ++i < o; )
                    (n = t[i]).callback.call(n.ctx, r);
                return;
            case 2:
                for (; ++i < o; )
                    (n = t[i]).callback.call(n.ctx, r, s);
                return;
            case 3:
                for (; ++i < o; )
                    (n = t[i]).callback.call(n.ctx, r, s, a);
                return;
            default:
                for (; ++i < o; )
                    (n = t[i]).callback.apply(n.ctx, e)
            }
        }
          , s = /\s+/
          , a = function(t, e, n, i) {
            if (!n)
                return !0;
            if ("object" == typeof n) {
                for (var o in n)
                    t[e].apply(t, [o, n[o]].concat(i));
                return !1
            }
            if (s.test(n)) {
                for (var r = n.split(s), a = 0, c = r.length; a < c; a++)
                    t[e].apply(t, [r[a]].concat(i));
                return !1
            }
            return !0
        };
        o.Events = {
            on: function(t, e, n) {
                return a(this, "on", t, [e, n]) && e ? (this._events = this._events || {},
                (this._events[t] || (this._events[t] = [])).push({
                    callback: e,
                    context: n,
                    ctx: n || this
                }),
                this) : this
            },
            once: function(t, e, n) {
                if (!a(this, "once", t, [e, n]) || !e)
                    return this;
                var o = this
                  , r = i.once(function() {
                    o.off(t, r),
                    e.apply(this, arguments)
                });
                return r._callback = e,
                this.on(t, r, n)
            },
            off: function(t, e, n) {
                var o, r, s, c, l, u, p, h;
                if (!this._events || !a(this, "off", t, [e, n]))
                    return this;
                if (!t && !e && !n)
                    return this._events = {},
                    this;
                for (l = 0,
                u = (c = t ? [t] : i.keys(this._events)).length; l < u; l++)
                    if (t = c[l],
                    s = this._events[t]) {
                        if (this._events[t] = o = [],
                        e || n)
                            for (p = 0,
                            h = s.length; p < h; p++)
                                r = s[p],
                                (e && e !== r.callback && e !== r.callback._callback || n && n !== r.context) && o.push(r);
                        o.length || delete this._events[t]
                    }
                return this
            },
            trigger: function(t) {
                if (!this._events)
                    return this;
                var e = Array.prototype.slice.call(arguments, 1);
                if (!a(this, "trigger", t, e))
                    return this;
                var n = this._events[t]
                  , i = this._events.all;
                return n && r(n, e),
                i && r(i, arguments),
                this
            },
            triggerLater: function() {
                var t = this
                  , e = arguments;
                window.setTimeout(function() {
                    t.trigger.apply(t, e)
                }, 0)
            },
            stopListening: function(t, e, n) {
                var i = this._listeners;
                if (!i)
                    return this;
                var o = !e && !n;
                for (var r in "object" == typeof e && (n = this),
                t && ((i = {})[t._listenerId] = t),
                i)
                    i[r].off(e, n, this),
                    o && delete this._listeners[r];
                return this
            }
        };
        i.each({
            listenTo: "on",
            listenToOnce: "once"
        }, function(t, e) {
            o.Events[e] = function(e, n, o) {
                return (this._listeners || (this._listeners = {}))[e._listenerId || (e._listenerId = i.uniqueId("l"))] = e,
                "object" == typeof n && (o = this),
                e[t](n, o, this),
                this
            }
        }),
        o.Events.bind = o.Events.on,
        o.Events.unbind = o.Events.off,
        o.Events.Listener = {
            listenTo: function(t, e, n) {
                if (!i.isFunction(n))
                    throw new Error("Illegal argument: expecting function as callback, was: " + n);
                return this._handlers = this._handlers || [],
                t.on(e, n, this),
                this._handlers.push({
                    unbind: function() {
                        t.off(e, n)
                    }
                }),
                this
            },
            stopListening: function() {
                if (this._handlers)
                    for (var t = 0; t < this._handlers.length; t++)
                        this._handlers[t].unbind()
            }
        },
        o.propagate = function(t, e) {
            if (!i.isFunction(e))
                throw "Illegal argument: provided callback is not a function";
            return function(n) {
                if (n)
                    return e(n);
                e(null, t)
            }
        }
        ;
        var c = function() {};
        o.inherits = function(t, e, n) {
            var o;
            return o = e && e.hasOwnProperty("constructor") ? e.constructor : function() {
                t.apply(this, arguments)
            }
            ,
            i.extend(o, t),
            c.prototype = t.prototype,
            o.prototype = new c,
            e && i.extend(o.prototype, e),
            n && i.extend(o, n),
            o.prototype.constructor = o,
            o.__super__ = t.prototype,
            o
        }
        ,
        o.getJSON = function(e, n) {
            if ("undefined" == typeof window || "undefined" != typeof nwglobal) {
                var i = t("fs")
                  , o = JSON.parse(i.readFileSync(e, "utf8"));
                n(null, o)
            } else {
                window.$.getJSON(e).done(function(t) {
                    n(null, t)
                }).error(function(t) {
                    n(t, null)
                })
            }
        }
        ,
        o.prototype = function(t) {
            return Object.getPrototypeOf ? Object.getPrototypeOf(t) : t.__proto__
        }
        ,
        o.inherit = function(t, e) {
            var n, o = i.isFunction(t) ? new t : t;
            if (i.isFunction(e))
                e.prototype = o,
                n = new e;
            else {
                var r = function() {};
                r.prototype = o,
                n = i.extend(new r, e)
            }
            return n
        }
        ,
        o.pimpl = function(t) {
            var e = function(t) {
                this.self = t
            };
            return e.prototype = t,
            function(t) {
                return new e(t = t || this)
            }
        }
        ,
        o.parseStackTrace = function(t) {
            var e, n = /([^@]*)@(.*):(\d+)/, i = /\s*at ([^(]*)[(](.*):(\d+):(\d+)[)]/, o = t.stack.split("\n"), r = [];
            for (e = 0; e < o.length; e++) {
                var s, a = n.exec(o[e]);
                a || (a = i.exec(o[e])),
                a ? "" === (s = {
                    func: a[1],
                    file: a[2],
                    line: a[3],
                    col: a[4] || 0
                }).func && (s.func = "<anonymous>") : s = {
                    func: "",
                    file: o[e],
                    line: "",
                    col: ""
                },
                r.push(s)
            }
            return r
        }
        ,
        o.callstack = function(t) {
            var e;
            try {
                throw new Error
            } catch (t) {
                e = t
            }
            var n = o.parseStackTrace(e);
            return t = t || 0,
            n.splice(t + 1)
        }
        ,
        o.stacktrace = function(t) {
            var e = 0 === arguments.length ? o.callstack().splice(1) : o.parseStackTrace(t)
              , n = [];
            return i.each(e, function(t) {
                n.push(t.file + ":" + t.line + ":" + t.col + " (" + t.func + ")")
            }),
            n.join("\n")
        }
        ,
        o.printStackTrace = function(t, e) {
            if (t.stack) {
                var n;
                if (void 0 !== t.__stack)
                    n = t.__stack;
                else {
                    if (!i.isString(t.stack))
                        return;
                    n = o.parseStackTrace(t)
                }
                e = e || n.length,
                e = Math.min(e, n.length);
                for (var r = 0; r < e; r++) {
                    var s = n[r];
                    console.log(s.file + ":" + s.line + ":" + s.col, "(" + s.func + ")")
                }
            }
        }
        ,
        o.diff = function(t, e) {
            var n;
            return i.isArray(t) && i.isArray(e) ? 0 === (n = i.difference(e, t)).length ? null : n : i.isObject(t) && i.isObject(e) ? (n = {},
            i.each(Object.keys(e), function(i) {
                var r = o.diff(t[i], e[i]);
                r && (n[i] = r)
            }),
            i.isEmpty(n) ? null : n) : t !== e ? e : void 0
        }
        ,
        o.deepclone = function(t) {
            if (void 0 !== t)
                return null === t ? null : JSON.parse(JSON.stringify(t))
        }
        ,
        o.clone = function(t) {
            return null === t || void 0 === t ? t : i.isFunction(t.clone) ? t.clone() : o.deepclone(t)
        }
        ,
        o.freeze = function(t) {
            var e;
            if (i.isObject(t)) {
                if (Object.isFrozen(t))
                    return t;
                var n = Object.keys(t);
                for (e = 0; e < n.length; e++) {
                    var r = n[e];
                    t[r] = o.freeze(t[r])
                }
                return Object.freeze(t)
            }
            if (i.isArray(t)) {
                var s = t;
                for (e = 0; e < s.length; e++)
                    s[e] = o.freeze(s[e]);
                return Object.freeze(s)
            }
            return t
        }
        ,
        o.later = function(t, e) {
            return function() {
                var n = arguments;
                window.setTimeout(function() {
                    t.apply(e, n)
                }, 0)
            }
        }
        ,
        o.isEmpty = function(t) {
            return !t.match(/\w/)
        }
        ,
        o.slug = function(t) {
            t = (t = t.replace(/^\s+|\s+$/g, "")).toLowerCase();
            for (var e = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;", n = 0, i = e.length; n < i; n++)
                t = t.replace(new RegExp(e.charAt(n),"g"), "aaaaeeeeiiiioooouuuunc------".charAt(n));
            return t = t.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
        }
        ,
        o.getReadableFileSizeString = function(t) {
            var e = -1;
            do {
                t /= 1024,
                e++
            } while (t > 1024);
            return Math.max(t, .1).toFixed(1) + [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"][e]
        }
        ,
        e.exports = o
    }
    , {
        fs: 2,
        underscore: 183
    }],
    183: [function(t, e, n) {
        (function() {
            var t = this
              , i = t._
              , o = Array.prototype
              , r = Object.prototype
              , s = Function.prototype
              , a = o.push
              , c = o.slice
              , l = r.toString
              , u = r.hasOwnProperty
              , p = Array.isArray
              , h = Object.keys
              , d = s.bind
              , f = Object.create
              , g = function() {}
              , y = function(t) {
                return t instanceof y ? t : this instanceof y ? void (this._wrapped = t) : new y(t)
            };
            void 0 !== n ? (void 0 !== e && e.exports && (n = e.exports = y),
            n._ = y) : t._ = y,
            y.VERSION = "1.8.3";
            var m = function(t, e, n) {
                if (void 0 === e)
                    return t;
                switch (null == n ? 3 : n) {
                case 1:
                    return function(n) {
                        return t.call(e, n)
                    }
                    ;
                case 2:
                    return function(n, i) {
                        return t.call(e, n, i)
                    }
                    ;
                case 3:
                    return function(n, i, o) {
                        return t.call(e, n, i, o)
                    }
                    ;
                case 4:
                    return function(n, i, o, r) {
                        return t.call(e, n, i, o, r)
                    }
                }
                return function() {
                    return t.apply(e, arguments)
                }
            }
              , v = function(t, e, n) {
                return null == t ? y.identity : y.isFunction(t) ? m(t, e, n) : y.isObject(t) ? y.matcher(t) : y.property(t)
            };
            y.iteratee = function(t, e) {
                return v(t, e, 1 / 0)
            }
            ;
            var b = function(t, e) {
                return function(n) {
                    var i = arguments.length;
                    if (i < 2 || null == n)
                        return n;
                    for (var o = 1; o < i; o++)
                        for (var r = arguments[o], s = t(r), a = s.length, c = 0; c < a; c++) {
                            var l = s[c];
                            e && void 0 !== n[l] || (n[l] = r[l])
                        }
                    return n
                }
            }
              , w = function(t) {
                if (!y.isObject(t))
                    return {};
                if (f)
                    return f(t);
                g.prototype = t;
                var e = new g;
                return g.prototype = null,
                e
            }
              , _ = function(t) {
                return function(e) {
                    return null == e ? void 0 : e[t]
                }
            }
              , x = Math.pow(2, 53) - 1
              , C = _("length")
              , P = function(t) {
                var e = C(t);
                return "number" == typeof e && e >= 0 && e <= x
            };
            function T(t) {
                return function(e, n, i, o) {
                    n = m(n, o, 4);
                    var r = !P(e) && y.keys(e)
                      , s = (r || e).length
                      , a = t > 0 ? 0 : s - 1;
                    return arguments.length < 3 && (i = e[r ? r[a] : a],
                    a += t),
                    function(e, n, i, o, r, s) {
                        for (; r >= 0 && r < s; r += t) {
                            var a = o ? o[r] : r;
                            i = n(i, e[a], a, e)
                        }
                        return i
                    }(e, n, i, r, a, s)
                }
            }
            y.each = y.forEach = function(t, e, n) {
                var i, o;
                if (e = m(e, n),
                P(t))
                    for (i = 0,
                    o = t.length; i < o; i++)
                        e(t[i], i, t);
                else {
                    var r = y.keys(t);
                    for (i = 0,
                    o = r.length; i < o; i++)
                        e(t[r[i]], r[i], t)
                }
                return t
            }
            ,
            y.map = y.collect = function(t, e, n) {
                e = v(e, n);
                for (var i = !P(t) && y.keys(t), o = (i || t).length, r = Array(o), s = 0; s < o; s++) {
                    var a = i ? i[s] : s;
                    r[s] = e(t[a], a, t)
                }
                return r
            }
            ,
            y.reduce = y.foldl = y.inject = T(1),
            y.reduceRight = y.foldr = T(-1),
            y.find = y.detect = function(t, e, n) {
                var i;
                if (void 0 !== (i = P(t) ? y.findIndex(t, e, n) : y.findKey(t, e, n)) && -1 !== i)
                    return t[i]
            }
            ,
            y.filter = y.select = function(t, e, n) {
                var i = [];
                return e = v(e, n),
                y.each(t, function(t, n, o) {
                    e(t, n, o) && i.push(t)
                }),
                i
            }
            ,
            y.reject = function(t, e, n) {
                return y.filter(t, y.negate(v(e)), n)
            }
            ,
            y.every = y.all = function(t, e, n) {
                e = v(e, n);
                for (var i = !P(t) && y.keys(t), o = (i || t).length, r = 0; r < o; r++) {
                    var s = i ? i[r] : r;
                    if (!e(t[s], s, t))
                        return !1
                }
                return !0
            }
            ,
            y.some = y.any = function(t, e, n) {
                e = v(e, n);
                for (var i = !P(t) && y.keys(t), o = (i || t).length, r = 0; r < o; r++) {
                    var s = i ? i[r] : r;
                    if (e(t[s], s, t))
                        return !0
                }
                return !1
            }
            ,
            y.contains = y.includes = y.include = function(t, e, n, i) {
                return P(t) || (t = y.values(t)),
                ("number" != typeof n || i) && (n = 0),
                y.indexOf(t, e, n) >= 0
            }
            ,
            y.invoke = function(t, e) {
                var n = c.call(arguments, 2)
                  , i = y.isFunction(e);
                return y.map(t, function(t) {
                    var o = i ? e : t[e];
                    return null == o ? o : o.apply(t, n)
                })
            }
            ,
            y.pluck = function(t, e) {
                return y.map(t, y.property(e))
            }
            ,
            y.where = function(t, e) {
                return y.filter(t, y.matcher(e))
            }
            ,
            y.findWhere = function(t, e) {
                return y.find(t, y.matcher(e))
            }
            ,
            y.max = function(t, e, n) {
                var i, o, r = -1 / 0, s = -1 / 0;
                if (null == e && null != t)
                    for (var a = 0, c = (t = P(t) ? t : y.values(t)).length; a < c; a++)
                        (i = t[a]) > r && (r = i);
                else
                    e = v(e, n),
                    y.each(t, function(t, n, i) {
                        ((o = e(t, n, i)) > s || o === -1 / 0 && r === -1 / 0) && (r = t,
                        s = o)
                    });
                return r
            }
            ,
            y.min = function(t, e, n) {
                var i, o, r = 1 / 0, s = 1 / 0;
                if (null == e && null != t)
                    for (var a = 0, c = (t = P(t) ? t : y.values(t)).length; a < c; a++)
                        (i = t[a]) < r && (r = i);
                else
                    e = v(e, n),
                    y.each(t, function(t, n, i) {
                        ((o = e(t, n, i)) < s || o === 1 / 0 && r === 1 / 0) && (r = t,
                        s = o)
                    });
                return r
            }
            ,
            y.shuffle = function(t) {
                for (var e, n = P(t) ? t : y.values(t), i = n.length, o = Array(i), r = 0; r < i; r++)
                    (e = y.random(0, r)) !== r && (o[r] = o[e]),
                    o[e] = n[r];
                return o
            }
            ,
            y.sample = function(t, e, n) {
                return null == e || n ? (P(t) || (t = y.values(t)),
                t[y.random(t.length - 1)]) : y.shuffle(t).slice(0, Math.max(0, e))
            }
            ,
            y.sortBy = function(t, e, n) {
                return e = v(e, n),
                y.pluck(y.map(t, function(t, n, i) {
                    return {
                        value: t,
                        index: n,
                        criteria: e(t, n, i)
                    }
                }).sort(function(t, e) {
                    var n = t.criteria
                      , i = e.criteria;
                    if (n !== i) {
                        if (n > i || void 0 === n)
                            return 1;
                        if (n < i || void 0 === i)
                            return -1
                    }
                    return t.index - e.index
                }), "value")
            }
            ;
            var N = function(t) {
                return function(e, n, i) {
                    var o = {};
                    return n = v(n, i),
                    y.each(e, function(i, r) {
                        var s = n(i, r, e);
                        t(o, i, s)
                    }),
                    o
                }
            };
            y.groupBy = N(function(t, e, n) {
                y.has(t, n) ? t[n].push(e) : t[n] = [e]
            }),
            y.indexBy = N(function(t, e, n) {
                t[n] = e
            }),
            y.countBy = N(function(t, e, n) {
                y.has(t, n) ? t[n]++ : t[n] = 1
            }),
            y.toArray = function(t) {
                return t ? y.isArray(t) ? c.call(t) : P(t) ? y.map(t, y.identity) : y.values(t) : []
            }
            ,
            y.size = function(t) {
                return null == t ? 0 : P(t) ? t.length : y.keys(t).length
            }
            ,
            y.partition = function(t, e, n) {
                e = v(e, n);
                var i = []
                  , o = [];
                return y.each(t, function(t, n, r) {
                    (e(t, n, r) ? i : o).push(t)
                }),
                [i, o]
            }
            ,
            y.first = y.head = y.take = function(t, e, n) {
                if (null != t)
                    return null == e || n ? t[0] : y.initial(t, t.length - e)
            }
            ,
            y.initial = function(t, e, n) {
                return c.call(t, 0, Math.max(0, t.length - (null == e || n ? 1 : e)))
            }
            ,
            y.last = function(t, e, n) {
                if (null != t)
                    return null == e || n ? t[t.length - 1] : y.rest(t, Math.max(0, t.length - e))
            }
            ,
            y.rest = y.tail = y.drop = function(t, e, n) {
                return c.call(t, null == e || n ? 1 : e)
            }
            ,
            y.compact = function(t) {
                return y.filter(t, y.identity)
            }
            ;
            var V = function(t, e, n, i) {
                for (var o = [], r = 0, s = i || 0, a = C(t); s < a; s++) {
                    var c = t[s];
                    if (P(c) && (y.isArray(c) || y.isArguments(c))) {
                        e || (c = V(c, e, n));
                        var l = 0
                          , u = c.length;
                        for (o.length += u; l < u; )
                            o[r++] = c[l++]
                    } else
                        n || (o[r++] = c)
                }
                return o
            };
            function k(t) {
                return function(e, n, i) {
                    n = v(n, i);
                    for (var o = C(e), r = t > 0 ? 0 : o - 1; r >= 0 && r < o; r += t)
                        if (n(e[r], r, e))
                            return r;
                    return -1
                }
            }
            function A(t, e, n) {
                return function(i, o, r) {
                    var s = 0
                      , a = C(i);
                    if ("number" == typeof r)
                        t > 0 ? s = r >= 0 ? r : Math.max(r + a, s) : a = r >= 0 ? Math.min(r + 1, a) : r + a + 1;
                    else if (n && r && a)
                        return i[r = n(i, o)] === o ? r : -1;
                    if (o != o)
                        return (r = e(c.call(i, s, a), y.isNaN)) >= 0 ? r + s : -1;
                    for (r = t > 0 ? s : a - 1; r >= 0 && r < a; r += t)
                        if (i[r] === o)
                            return r;
                    return -1
                }
            }
            y.flatten = function(t, e) {
                return V(t, e, !1)
            }
            ,
            y.without = function(t) {
                return y.difference(t, c.call(arguments, 1))
            }
            ,
            y.uniq = y.unique = function(t, e, n, i) {
                y.isBoolean(e) || (i = n,
                n = e,
                e = !1),
                null != n && (n = v(n, i));
                for (var o = [], r = [], s = 0, a = C(t); s < a; s++) {
                    var c = t[s]
                      , l = n ? n(c, s, t) : c;
                    e ? (s && r === l || o.push(c),
                    r = l) : n ? y.contains(r, l) || (r.push(l),
                    o.push(c)) : y.contains(o, c) || o.push(c)
                }
                return o
            }
            ,
            y.union = function() {
                return y.uniq(V(arguments, !0, !0))
            }
            ,
            y.intersection = function(t) {
                for (var e = [], n = arguments.length, i = 0, o = C(t); i < o; i++) {
                    var r = t[i];
                    if (!y.contains(e, r)) {
                        for (var s = 1; s < n && y.contains(arguments[s], r); s++)
                            ;
                        s === n && e.push(r)
                    }
                }
                return e
            }
            ,
            y.difference = function(t) {
                var e = V(arguments, !0, !0, 1);
                return y.filter(t, function(t) {
                    return !y.contains(e, t)
                })
            }
            ,
            y.zip = function() {
                return y.unzip(arguments)
            }
            ,
            y.unzip = function(t) {
                for (var e = t && y.max(t, C).length || 0, n = Array(e), i = 0; i < e; i++)
                    n[i] = y.pluck(t, i);
                return n
            }
            ,
            y.object = function(t, e) {
                for (var n = {}, i = 0, o = C(t); i < o; i++)
                    e ? n[t[i]] = e[i] : n[t[i][0]] = t[i][1];
                return n
            }
            ,
            y.findIndex = k(1),
            y.findLastIndex = k(-1),
            y.sortedIndex = function(t, e, n, i) {
                for (var o = (n = v(n, i, 1))(e), r = 0, s = C(t); r < s; ) {
                    var a = Math.floor((r + s) / 2);
                    n(t[a]) < o ? r = a + 1 : s = a
                }
                return r
            }
            ,
            y.indexOf = A(1, y.findIndex, y.sortedIndex),
            y.lastIndexOf = A(-1, y.findLastIndex),
            y.range = function(t, e, n) {
                null == e && (e = t || 0,
                t = 0),
                n = n || 1;
                for (var i = Math.max(Math.ceil((e - t) / n), 0), o = Array(i), r = 0; r < i; r++,
                t += n)
                    o[r] = t;
                return o
            }
            ;
            var S = function(t, e, n, i, o) {
                if (!(i instanceof e))
                    return t.apply(n, o);
                var r = w(t.prototype)
                  , s = t.apply(r, o);
                return y.isObject(s) ? s : r
            };
            y.bind = function(t, e) {
                if (d && t.bind === d)
                    return d.apply(t, c.call(arguments, 1));
                if (!y.isFunction(t))
                    throw new TypeError("Bind must be called on a function");
                var n = c.call(arguments, 2)
                  , i = function() {
                    return S(t, i, e, this, n.concat(c.call(arguments)))
                };
                return i
            }
            ,
            y.partial = function(t) {
                var e = c.call(arguments, 1)
                  , n = function() {
                    for (var i = 0, o = e.length, r = Array(o), s = 0; s < o; s++)
                        r[s] = e[s] === y ? arguments[i++] : e[s];
                    for (; i < arguments.length; )
                        r.push(arguments[i++]);
                    return S(t, n, this, this, r)
                };
                return n
            }
            ,
            y.bindAll = function(t) {
                var e, n, i = arguments.length;
                if (i <= 1)
                    throw new Error("bindAll must be passed function names");
                for (e = 1; e < i; e++)
                    t[n = arguments[e]] = y.bind(t[n], t);
                return t
            }
            ,
            y.memoize = function(t, e) {
                var n = function(i) {
                    var o = n.cache
                      , r = "" + (e ? e.apply(this, arguments) : i);
                    return y.has(o, r) || (o[r] = t.apply(this, arguments)),
                    o[r]
                };
                return n.cache = {},
                n
            }
            ,
            y.delay = function(t, e) {
                var n = c.call(arguments, 2);
                return setTimeout(function() {
                    return t.apply(null, n)
                }, e)
            }
            ,
            y.defer = y.partial(y.delay, y, 1),
            y.throttle = function(t, e, n) {
                var i, o, r, s = null, a = 0;
                n || (n = {});
                var c = function() {
                    a = !1 === n.leading ? 0 : y.now(),
                    s = null,
                    r = t.apply(i, o),
                    s || (i = o = null)
                };
                return function() {
                    var l = y.now();
                    a || !1 !== n.leading || (a = l);
                    var u = e - (l - a);
                    return i = this,
                    o = arguments,
                    u <= 0 || u > e ? (s && (clearTimeout(s),
                    s = null),
                    a = l,
                    r = t.apply(i, o),
                    s || (i = o = null)) : s || !1 === n.trailing || (s = setTimeout(c, u)),
                    r
                }
            }
            ,
            y.debounce = function(t, e, n) {
                var i, o, r, s, a, c = function() {
                    var l = y.now() - s;
                    l < e && l >= 0 ? i = setTimeout(c, e - l) : (i = null,
                    n || (a = t.apply(r, o),
                    i || (r = o = null)))
                };
                return function() {
                    r = this,
                    o = arguments,
                    s = y.now();
                    var l = n && !i;
                    return i || (i = setTimeout(c, e)),
                    l && (a = t.apply(r, o),
                    r = o = null),
                    a
                }
            }
            ,
            y.wrap = function(t, e) {
                return y.partial(e, t)
            }
            ,
            y.negate = function(t) {
                return function() {
                    return !t.apply(this, arguments)
                }
            }
            ,
            y.compose = function() {
                var t = arguments
                  , e = t.length - 1;
                return function() {
                    for (var n = e, i = t[e].apply(this, arguments); n--; )
                        i = t[n].call(this, i);
                    return i
                }
            }
            ,
            y.after = function(t, e) {
                return function() {
                    if (--t < 1)
                        return e.apply(this, arguments)
                }
            }
            ,
            y.before = function(t, e) {
                var n;
                return function() {
                    return --t > 0 && (n = e.apply(this, arguments)),
                    t <= 1 && (e = null),
                    n
                }
            }
            ,
            y.once = y.partial(y.before, 2);
            var E = !{
                toString: null
            }.propertyIsEnumerable("toString")
              , I = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
            function $(t, e) {
                var n = I.length
                  , i = t.constructor
                  , o = y.isFunction(i) && i.prototype || r
                  , s = "constructor";
                for (y.has(t, s) && !y.contains(e, s) && e.push(s); n--; )
                    (s = I[n])in t && t[s] !== o[s] && !y.contains(e, s) && e.push(s)
            }
            y.keys = function(t) {
                if (!y.isObject(t))
                    return [];
                if (h)
                    return h(t);
                var e = [];
                for (var n in t)
                    y.has(t, n) && e.push(n);
                return E && $(t, e),
                e
            }
            ,
            y.allKeys = function(t) {
                if (!y.isObject(t))
                    return [];
                var e = [];
                for (var n in t)
                    e.push(n);
                return E && $(t, e),
                e
            }
            ,
            y.values = function(t) {
                for (var e = y.keys(t), n = e.length, i = Array(n), o = 0; o < n; o++)
                    i[o] = t[e[o]];
                return i
            }
            ,
            y.mapObject = function(t, e, n) {
                e = v(e, n);
                for (var i, o = y.keys(t), r = o.length, s = {}, a = 0; a < r; a++)
                    s[i = o[a]] = e(t[i], i, t);
                return s
            }
            ,
            y.pairs = function(t) {
                for (var e = y.keys(t), n = e.length, i = Array(n), o = 0; o < n; o++)
                    i[o] = [e[o], t[e[o]]];
                return i
            }
            ,
            y.invert = function(t) {
                for (var e = {}, n = y.keys(t), i = 0, o = n.length; i < o; i++)
                    e[t[n[i]]] = n[i];
                return e
            }
            ,
            y.functions = y.methods = function(t) {
                var e = [];
                for (var n in t)
                    y.isFunction(t[n]) && e.push(n);
                return e.sort()
            }
            ,
            y.extend = b(y.allKeys),
            y.extendOwn = y.assign = b(y.keys),
            y.findKey = function(t, e, n) {
                e = v(e, n);
                for (var i, o = y.keys(t), r = 0, s = o.length; r < s; r++)
                    if (e(t[i = o[r]], i, t))
                        return i
            }
            ,
            y.pick = function(t, e, n) {
                var i, o, r = {}, s = t;
                if (null == s)
                    return r;
                y.isFunction(e) ? (o = y.allKeys(s),
                i = m(e, n)) : (o = V(arguments, !1, !1, 1),
                i = function(t, e, n) {
                    return e in n
                }
                ,
                s = Object(s));
                for (var a = 0, c = o.length; a < c; a++) {
                    var l = o[a]
                      , u = s[l];
                    i(u, l, s) && (r[l] = u)
                }
                return r
            }
            ,
            y.omit = function(t, e, n) {
                if (y.isFunction(e))
                    e = y.negate(e);
                else {
                    var i = y.map(V(arguments, !1, !1, 1), String);
                    e = function(t, e) {
                        return !y.contains(i, e)
                    }
                }
                return y.pick(t, e, n)
            }
            ,
            y.defaults = b(y.allKeys, !0),
            y.create = function(t, e) {
                var n = w(t);
                return e && y.extendOwn(n, e),
                n
            }
            ,
            y.clone = function(t) {
                return y.isObject(t) ? y.isArray(t) ? t.slice() : y.extend({}, t) : t
            }
            ,
            y.tap = function(t, e) {
                return e(t),
                t
            }
            ,
            y.isMatch = function(t, e) {
                var n = y.keys(e)
                  , i = n.length;
                if (null == t)
                    return !i;
                for (var o = Object(t), r = 0; r < i; r++) {
                    var s = n[r];
                    if (e[s] !== o[s] || !(s in o))
                        return !1
                }
                return !0
            }
            ;
            var j = function(t, e, n, i) {
                if (t === e)
                    return 0 !== t || 1 / t == 1 / e;
                if (null == t || null == e)
                    return t === e;
                t instanceof y && (t = t._wrapped),
                e instanceof y && (e = e._wrapped);
                var o = l.call(t);
                if (o !== l.call(e))
                    return !1;
                switch (o) {
                case "[object RegExp]":
                case "[object String]":
                    return "" + t == "" + e;
                case "[object Number]":
                    return +t != +t ? +e != +e : 0 == +t ? 1 / +t == 1 / e : +t == +e;
                case "[object Date]":
                case "[object Boolean]":
                    return +t == +e
                }
                var r = "[object Array]" === o;
                if (!r) {
                    if ("object" != typeof t || "object" != typeof e)
                        return !1;
                    var s = t.constructor
                      , a = e.constructor;
                    if (s !== a && !(y.isFunction(s) && s instanceof s && y.isFunction(a) && a instanceof a) && "constructor"in t && "constructor"in e)
                        return !1
                }
                n = n || [],
                i = i || [];
                for (var c = n.length; c--; )
                    if (n[c] === t)
                        return i[c] === e;
                if (n.push(t),
                i.push(e),
                r) {
                    if ((c = t.length) !== e.length)
                        return !1;
                    for (; c--; )
                        if (!j(t[c], e[c], n, i))
                            return !1
                } else {
                    var u, p = y.keys(t);
                    if (c = p.length,
                    y.keys(e).length !== c)
                        return !1;
                    for (; c--; )
                        if (u = p[c],
                        !y.has(e, u) || !j(t[u], e[u], n, i))
                            return !1
                }
                return n.pop(),
                i.pop(),
                !0
            };
            y.isEqual = function(t, e) {
                return j(t, e)
            }
            ,
            y.isEmpty = function(t) {
                return null == t || (P(t) && (y.isArray(t) || y.isString(t) || y.isArguments(t)) ? 0 === t.length : 0 === y.keys(t).length)
            }
            ,
            y.isElement = function(t) {
                return !(!t || 1 !== t.nodeType)
            }
            ,
            y.isArray = p || function(t) {
                return "[object Array]" === l.call(t)
            }
            ,
            y.isObject = function(t) {
                var e = typeof t;
                return "function" === e || "object" === e && !!t
            }
            ,
            y.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(t) {
                y["is" + t] = function(e) {
                    return l.call(e) === "[object " + t + "]"
                }
            }),
            y.isArguments(arguments) || (y.isArguments = function(t) {
                return y.has(t, "callee")
            }
            ),
            "function" != typeof /./ && "object" != typeof Int8Array && (y.isFunction = function(t) {
                return "function" == typeof t || !1
            }
            ),
            y.isFinite = function(t) {
                return isFinite(t) && !isNaN(parseFloat(t))
            }
            ,
            y.isNaN = function(t) {
                return y.isNumber(t) && t !== +t
            }
            ,
            y.isBoolean = function(t) {
                return !0 === t || !1 === t || "[object Boolean]" === l.call(t)
            }
            ,
            y.isNull = function(t) {
                return null === t
            }
            ,
            y.isUndefined = function(t) {
                return void 0 === t
            }
            ,
            y.has = function(t, e) {
                return null != t && u.call(t, e)
            }
            ,
            y.noConflict = function() {
                return t._ = i,
                this
            }
            ,
            y.identity = function(t) {
                return t
            }
            ,
            y.constant = function(t) {
                return function() {
                    return t
                }
            }
            ,
            y.noop = function() {}
            ,
            y.property = _,
            y.propertyOf = function(t) {
                return null == t ? function() {}
                : function(e) {
                    return t[e]
                }
            }
            ,
            y.matcher = y.matches = function(t) {
                return t = y.extendOwn({}, t),
                function(e) {
                    return y.isMatch(e, t)
                }
            }
            ,
            y.times = function(t, e, n) {
                var i = Array(Math.max(0, t));
                e = m(e, n, 1);
                for (var o = 0; o < t; o++)
                    i[o] = e(o);
                return i
            }
            ,
            y.random = function(t, e) {
                return null == e && (e = t,
                t = 0),
                t + Math.floor(Math.random() * (e - t + 1))
            }
            ,
            y.now = Date.now || function() {
                return (new Date).getTime()
            }
            ;
            var M = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            }
              , q = y.invert(M)
              , L = function(t) {
                var e = function(e) {
                    return t[e]
                }
                  , n = "(?:" + y.keys(t).join("|") + ")"
                  , i = RegExp(n)
                  , o = RegExp(n, "g");
                return function(t) {
                    return t = null == t ? "" : "" + t,
                    i.test(t) ? t.replace(o, e) : t
                }
            };
            y.escape = L(M),
            y.unescape = L(q),
            y.result = function(t, e, n) {
                var i = null == t ? void 0 : t[e];
                return void 0 === i && (i = n),
                y.isFunction(i) ? i.call(t) : i
            }
            ;
            var O = 0;
            y.uniqueId = function(t) {
                var e = ++O + "";
                return t ? t + e : e
            }
            ,
            y.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g
            };
            var D = /(.)^/
              , R = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\u2028": "u2028",
                "\u2029": "u2029"
            }
              , F = /\\|'|\r|\n|\u2028|\u2029/g
              , H = function(t) {
                return "\\" + R[t]
            };
            y.template = function(t, e, n) {
                !e && n && (e = n),
                e = y.defaults({}, e, y.templateSettings);
                var i = RegExp([(e.escape || D).source, (e.interpolate || D).source, (e.evaluate || D).source].join("|") + "|$", "g")
                  , o = 0
                  , r = "__p+='";
                t.replace(i, function(e, n, i, s, a) {
                    return r += t.slice(o, a).replace(F, H),
                    o = a + e.length,
                    n ? r += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'" : i ? r += "'+\n((__t=(" + i + "))==null?'':__t)+\n'" : s && (r += "';\n" + s + "\n__p+='"),
                    e
                }),
                r += "';\n",
                e.variable || (r = "with(obj||{}){\n" + r + "}\n"),
                r = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + r + "return __p;\n";
                try {
                    var s = new Function(e.variable || "obj","_",r)
                } catch (t) {
                    throw t.source = r,
                    t
                }
                var a = function(t) {
                    return s.call(this, t, y)
                }
                  , c = e.variable || "obj";
                return a.source = "function(" + c + "){\n" + r + "}",
                a
            }
            ,
            y.chain = function(t) {
                var e = y(t);
                return e._chain = !0,
                e
            }
            ;
            var U = function(t, e) {
                return t._chain ? y(e).chain() : e
            };
            y.mixin = function(t) {
                y.each(y.functions(t), function(e) {
                    var n = y[e] = t[e];
                    y.prototype[e] = function() {
                        var t = [this._wrapped];
                        return a.apply(t, arguments),
                        U(this, n.apply(y, t))
                    }
                })
            }
            ,
            y.mixin(y),
            y.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(t) {
                var e = o[t];
                y.prototype[t] = function() {
                    var n = this._wrapped;
                    return e.apply(n, arguments),
                    "shift" !== t && "splice" !== t || 0 !== n.length || delete n[0],
                    U(this, n)
                }
            }),
            y.each(["concat", "join", "slice"], function(t) {
                var e = o[t];
                y.prototype[t] = function() {
                    return U(this, e.apply(this._wrapped, arguments))
                }
            }),
            y.prototype.value = function() {
                return this._wrapped
            }
            ,
            y.prototype.valueOf = y.prototype.toJSON = y.prototype.value,
            y.prototype.toString = function() {
                return "" + this._wrapped
            }
            ,
            "function" == typeof define && define.amd && define("underscore", [], function() {
                return y
            })
        }
        ).call(this)
    }
    , {}],
    184: [function(t, e, n) {
        e.exports = {
            locale: "es"
        }
    }
    , {}],
    185: [function(t, e, n) {
        var i = t("./config");
        e.exports = function() {
            switch (i.locale) {
            case "es":
                return t("./locale/es");
            case "en":
                return t("./locale/en")
            }
        }
    }
    , {
        "./config": 184,
        "./locale/en": 186,
        "./locale/es": 187
    }],
    186: [function(t, e, n) {
        e.exports = {
            _contribTypeMapping: {
                author: "Author",
                "author non-byline": "Author",
                autahor: "Author",
                auther: "Author",
                editor: "Editor",
                "guest-editor": "Guest Editor",
                "group-author": "Group Author",
                collab: "Collaborator",
                "reviewed-by": "Reviewer",
                "nominated-by": "Nominator",
                corresp: "Corresponding Author",
                other: "Other",
                "assoc-editor": "Associate Editor",
                "associate editor": "Associate Editor",
                "series-editor": "Series Editor",
                contributor: "Contributor",
                chairman: "Chairman",
                "monographs-editor": "Monographs Editor",
                "contrib-author": "Contributing Author",
                organizer: "Organizer",
                chair: "Chair",
                discussant: "Discussant",
                presenter: "Presenter",
                "guest-issue-editor": "Guest Issue Editor",
                participant: "Participant",
                translator: "Translator"
            },
            _publicationTypes: {
                reference: "Reference",
                book: "Book",
                confproc: "Conference/Proceedings",
                database: "Database",
                journal: "Journal",
                patent: "Patent",
                report: "Technical report",
                software: "Software",
                thesis: "Thesis/Dissertation",
                webpage: "Webpage",
                "legal-doc": "Legal document",
                newspaper: "Newspaper",
                data: "Data",
                other: "Other"
            }
        }
    }
    , {}],
    187: [function(t, e, n) {
        e.exports = {
            _contribTypeMapping: {
                author: "Autor",
                "author non-byline": "Autor",
                autahor: "Autor",
                auther: "Autor",
                editor: "Editor",
                "guest-editor": "Editor invitado",
                "group-author": "Group Author",
                collab: "Colaborador",
                "reviewed-by": "Revisor",
                "nominated-by": "Nominator",
                corresp: "Autor de correspondencia",
                other: "Otro",
                "assoc-editor": "Editor asociado",
                "associate editor": "Editor asociado",
                "series-editor": "Series Editor",
                contributor: "Contributor",
                chairman: "Chairman",
                "monographs-editor": "Monographs Editor",
                "contrib-author": "Contributing Author",
                organizer: "Organizer",
                chair: "Chair",
                discussant: "Discussant",
                presenter: "Presenter",
                "guest-issue-editor": "Guest Issue Editor",
                participant: "Participant",
                translator: "Translator"
            },
            _publicationTypes: {
                reference: "Referencia",
                book: "Libro",
                confproc: "Conferencia/Ponencia",
                database: "Base de datos",
                journal: "Revista científica",
                patent: "Patente",
                report: "Reporte técnico",
                software: "Software",
                thesis: "Tesis",
                webpage: "Página web",
                "legal-doc": "Documento legal",
                newspaper: "Periódico",
                data: "Datos",
                other: "Otro"
            }
        }
    }
    , {}],
    188: [function(t, e, n) {
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Node.call(this, t, e)
        };
        o.type = {
            id: "annotation",
            properties: {
                path: ["array", "string"],
                range: ["array", "number"]
            }
        },
        (o.Prototype = function() {
            this.getLevel = function() {
                return this.constructor.fragmentation
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        o.NEVER = 1,
        o.OK = 2,
        o.fragmentation = o.DONT_CARE = 3,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    189: [function(t, e, n) {
        "use strict";
        var i = function(t, e) {
            this.node = t,
            this.viewFactory = e,
            this.el = this.createElement(),
            this.el.dataset.id = t.id,
            this.$el = $(this.el),
            this.setClasses()
        };
        i.Prototype = function() {
            this.createElement = function() {
                return document.createElement("span")
            }
            ,
            this.setClasses = function() {
                this.$el.addClass("annotation").addClass(this.node.type)
            }
            ,
            this.render = function() {
                return this
            }
        }
        ,
        i.prototype = new i.Prototype,
        e.exports = i
    }
    , {}],
    190: [function(t, e, n) {
        e.exports = {
            Model: t("./annotation.js"),
            View: t("./annotation_view.js")
        }
    }
    , {
        "./annotation.js": 188,
        "./annotation_view.js": 189
    }],
    191: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "attrib",
            parent: "content",
            properties: {
                source_id: "string",
                description: "paragraph",
                children: ["array", "paragraph"]
            }
        },
        o.description = {
            name: "Attrib",
            remarks: ["...", "..."],
            properties: {
                title: "Attrib title (optional)",
                children: "0..n Paragraph nodes"
            }
        },
        o.example = {
            id: "attrib_1",
            children: ["paragraph_1", "paragraph_2"]
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                return this.properties.children || []
            }
            ,
            this.hasDescription = function() {
                return !!this.properties.description
            }
            ,
            this.getDescription = function() {
                if (this.properties.description)
                    return this.document.get(this.properties.description)
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    192: [function(t, e, n) {
        "use strict";
        var i = t("lens/article/nodes/composite").View
          , o = t("lens/substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                if (this.content = o("div.content"),
                this.node.getDescription()) {
                    var t = this.createChildView(this.node.description).render().el;
                    t.classList.add("attrib-title"),
                    t.classList.add(".figure-attribution"),
                    this.content.appendChild(t)
                }
                return this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "lens/article/nodes/composite": 31,
        "lens/substance/application": 158
    }],
    193: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./attrib"),
            View: t("./attrib_view")
        }
    }
    , {
        "./attrib": 191,
        "./attrib_view": 192
    }],
    194: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "caption",
            parent: "content",
            properties: {
                source_id: "string",
                title: "paragraph",
                children: ["array", "paragraph"]
            }
        },
        o.description = {
            name: "Caption",
            remarks: ["Container element for the textual description that is associated with a Figure, Table, Video node etc.", "This is the title for the figure or the description of the figure that prints or displays with the figure."],
            properties: {
                title: "Caption title (optional)",
                children: "0..n Paragraph nodes"
            }
        },
        o.example = {
            id: "caption_1",
            children: ["paragraph_1", "paragraph_2"]
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                return this.properties.children || []
            }
            ,
            this.hasTitle = function() {
                return !!this.properties.title
            }
            ,
            this.getTitle = function() {
                if (this.properties.title)
                    return this.document.get(this.properties.title)
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    195: [function(t, e, n) {
        "use strict";
        var i = t("lens/article/nodes/composite").View
          , o = t("lens/substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                if (this.content = o("div.content"),
                this.node.getTitle()) {
                    var t = this.createChildView(this.node.title).render().el;
                    t.classList.add("caption-title"),
                    this.content.appendChild(t)
                }
                return this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "lens/article/nodes/composite": 31,
        "lens/substance/application": 158
    }],
    196: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./caption"),
            View: t("./caption_view")
        }
    }
    , {
        "./caption": 194,
        "./caption_view": 195
    }],
    197: [function(t, e, n) {
        var i = t("underscore")
          , o = t("lens/substance/document")
          , r = new (t("../../get_locale.js"))
          , s = function(t, e) {
            o.Node.call(this, t, e)
        };
        s.type = {
            id: "article_citation",
            parent: "content",
            properties: {
                publication_type: "string",
                source_id: "string",
                citation_text: "string"
            }
        },
        s.description = {
            name: "Citation",
            remarks: ["A journal citation.", "This element can be used to describe all kinds of citations."],
            properties: {
                publication_type: "The citation type, e.g.: book, journal, etc.",
                citation_text: "Citation as described in original PDF"
            }
        },
        s.example = {
            id: "article_nature08160",
            publication_type: "journal",
            citation_text: "Green, J.R. y S. Scotchmer. 1995. On the division of profit in sequential innovation, The RAND Journal of Economics, 26(1): 20-33."
        },
        (s.Prototype = function() {
            this.getHeader = function() {
                return i.compact([this.properties.label, r._publicationTypes[this.properties.publication_type] || r._publicationTypes.reference]).join(" - ")
            }
        }
        ).prototype = o.Node.prototype,
        (s.prototype = new s.Prototype).constructor = s,
        o.Node.defineProperties(s),
        e.exports = s
    }
    , {
        "../../get_locale.js": 185,
        "lens/substance/document": 171,
        underscore: 183
    }],
    198: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("lens/substance/application").$$
          , r = t("lens/article/nodes/node").View
          , s = t("lens/article/resource_view")
          , a = function(t, e, n) {
            r.apply(this, arguments),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.renderBody = function() {
                var t = document.createDocumentFragment()
                  , e = this.node;
                t.appendChild(o(".source", {
                    html: e.citation_text
                })),
                this.content.appendChild(t)
            }
        }
        ).prototype = r.prototype,
        (a.prototype = new a.Prototype).constructor = a,
        e.exports = a
    }
    , {
        "lens/article/nodes/node": 90,
        "lens/article/resource_view": 125,
        "lens/substance/application": 158,
        underscore: 183
    }],
    199: [function(t, e, n) {
        arguments[4][22][0].apply(n, arguments)
    }
    , {
        "./citation": 197,
        "./citation_view": 198,
        dup: 22
    }],
    200: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "colgroup",
            parent: "table",
            properties: {
                source_id: "string",
                content: "string"
            }
        },
        o.description = {
            name: "Colgroup",
            remarks: ["...", "..."],
            properties: {
                title: "Attrib title (optional)"
            }
        },
        o.example = {
            id: "attrib_1",
            content: "<colgroup>...</colgroup>"
        },
        (o.Prototype = function() {
            this.getContent = function() {
                if (this.properties.content)
                    return this.document.get(this.properties.content)
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    201: [function(t, e, n) {
        "use strict";
        var i = t("lens/article/nodes/composite").View
          , o = t("lens/substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.content = o("colgroup.table-wrapper-colgroup", {
                    html: this.node.properties.content
                }),
                this.el.appendChild(this.content),
                this
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "lens/article/nodes/composite": 31,
        "lens/substance/application": 158
    }],
    202: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./colgroup"),
            View: t("./colgroup_view")
        }
    }
    , {
        "./colgroup": 200,
        "./colgroup_view": 201
    }],
    203: [function(t, e, n) {
        "use strict";
        var i = t("../node").View
          , o = function(t, e) {
            i.call(this, t, e),
            this.childrenViews = []
        };
        (o.Prototype = function() {
            this.render = function() {
                return i.prototype.render.call(this),
                this.renderChildren(),
                this
            }
            ,
            this.renderChildren = function() {
                for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
                    var n = this.createChildView(t[e]).render().el;
                    this.content.appendChild(n)
                }
            }
            ,
            this.dispose = function() {
                i.prototype.dispose.call(this);
                for (var t = 0; t < this.childrenViews.length; t++)
                    this.childrenViews[t].dispose()
            }
            ,
            this.delete = function() {}
            ,
            this.getCharPosition = function() {
                return 0
            }
            ,
            this.getDOMPosition = function() {
                var t = this.$(".content")[0]
                  , e = document.createRange();
                return e.setStartBefore(t.childNodes[0]),
                e
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "../node": 219
    }],
    204: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document");
        e.exports = {
            Model: i.Composite,
            View: t("./composite_view")
        }
    }
    , {
        "./composite_view": 203,
        "lens/substance/document": 171
    }],
    205: [function(t, e, n) {
        var i = t("lens/article/nodes").cover.View
          , o = t("lens/substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                i.prototype.render.call(this);
                encodeURIComponent(window.location.href);
                var t = this.node.document.get("publication_info");
                if (t)
                    var e = o(".intro.container", {
                        children: [o(".subjects", {
                            html: t.journal
                        })]
                    });
                return this.content.insertBefore(e, this.content.firstChild),
                this
            }
        }
        ).prototype = i.prototype,
        (r.prototype = new r.Prototype).constructor = r,
        e.exports = r
    }
    , {
        "lens/article/nodes": 78,
        "lens/substance/application": 158
    }],
    206: [function(t, e, n) {
        "use strict";
        var i = t("lens/article/nodes").cover.Model;
        e.exports = {
            Model: i,
            View: t("./cover_view")
        }
    }
    , {
        "./cover_view": 205,
        "lens/article/nodes": 78
    }],
    207: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            parent: "content",
            properties: {
                source_id: "string",
                label: "string",
                url: "string",
                caption: "caption",
                attrib: ["array", "attrib"],
                position: "string"
            }
        },
        o.config = {
            zoomable: !0
        },
        o.description = {
            name: "Figure",
            remarks: ["A figure is a figure is figure."],
            properties: {
                label: "Label used as header for the figure cards",
                url: "Image url",
                caption: "A reference to a caption node that describes the figure",
                attrib: "Figure attribution"
            }
        },
        o.example = {
            id: "figure_1",
            label: "Figure 1",
            url: "http://example.com/fig1.png",
            caption: "caption_1",
            attrib: "attrib_1"
        },
        (o.Prototype = function() {
            this.hasCaption = function() {
                return !!this.properties.caption
            }
            ,
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.caption && t.push(this.properties.caption),
                this.properties.attrib && this.properties.attrib.forEach(e=>{
                    t.push(e)
                }
                ),
                t
            }
            ,
            this.getCaption = function() {
                if (this.properties.caption)
                    return this.document.get(this.properties.caption)
            }
            ,
            this.getHeader = function() {
                return this.properties.label
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o.prototype, Object.keys(o.type.properties)),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    208: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("lens/article/nodes/composite").View
          , r = t("lens/substance/application").$$
          , s = t("lens/article/resource_view")
          , a = function(t, e, n) {
            o.call(this, t, e),
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.isZoomable = !0,
            this.renderBody = function() {
                if (this.content.appendChild(r(".label", {
                    text: this.node.label
                })),
                this.node.url) {
                    var t = r(".image-wrapper", {
                        children: [r("a", {
                            href: this.node.url,
                            target: "_blank",
                            children: [r("img", {
                                src: this.node.url
                            })]
                        })]
                    });
                    this.content.appendChild(t)
                }
                this.renderChildren()
            }
            ,
            this.renderLabel = function() {
                var t = r(".name", {
                    href: "#"
                });
                return this.renderAnnotatedText([this.node.id, "label"], t),
                t
            }
        }
        ).prototype = o.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "lens/article/nodes/composite": 31,
        "lens/article/resource_view": 125,
        "lens/substance/application": 158,
        underscore: 183
    }],
    209: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./figure"),
            View: t("./figure_view")
        }
    }
    , {
        "./figure": 207,
        "./figure_view": 208
    }],
    210: [function(t, e, n) {
        "use strict";
        var i = t("../annotation/annotation_view")
          , o = t("lens/substance/application").$$
          , r = t("underscore")
          , s = function(t, e) {
            i.call(this, t, e),
            this.$el.addClass("footnote-reference"),
            this._expanded = !1
        };
        (s.Prototype = function() {
            this.proccesedNotes = [],
            this.render = function() {
                var t = this._getFootnote();
                -1 === r.indexOf(this.proccesedNotes, t.id) && (this.proccesedNotes.push(t.id),
                this.el.innerHTML = "",
                this.toggleEl = o("a", {
                    href: "#",
                    html: t.properties.label
                }),
                $(this.toggleEl).on("click", this._onToggle.bind(this)),
                this.$el.append(this.toggleEl),
                this.footnoteView = this._createView(t).render(),
                this.footnoteView.$el.addClass("footnote"),
                this.node.properties.generated && this.$el.addClass("sm-generated"),
                this.$el.append(this.footnoteView.el))
            }
            ,
            this._onToggle = function(t) {
                t.preventDefault(),
                this.$el.toggleClass("sm-expanded")
            }
            ,
            this._createView = function(t) {
                return this.viewFactory.createView(t)
            }
            ,
            this._getFootnote = function() {
                return this.node.document.get(this.node.target)
            }
        }
        ).prototype = i.prototype,
        s.prototype = new s.Prototype,
        e.exports = s
    }
    , {
        "../annotation/annotation_view": 189,
        "lens/substance/application": 158,
        underscore: 183
    }],
    211: [function(t, e, n) {
        "use strict";
        var i = t("lens/article/nodes").footnote_reference.Model;
        e.exports = {
            Model: i,
            View: t("./footnote_reference_view.js")
        }
    }
    , {
        "./footnote_reference_view.js": 210,
        "lens/article/nodes": 78
    }],
    212: [function(t, e, n) {
        var i = t("lens/substance/document")
          , o = function(t) {
            i.Node.call(this, t)
        };
        o.type = {
            id: "formula",
            parent: "content",
            properties: {
                source_id: "string",
                inline: "boolean",
                label: "string",
                format: ["array", "string"],
                data: ["array", "string"]
            }
        },
        o.description = {
            name: "Formula",
            remarks: ["Can either be expressed in MathML format or using an image url"],
            properties: {
                label: "Formula label (4)",
                data: "Formula data, either MathML or image url",
                format: "Can either be `mathml` or `image`"
            }
        },
        o.example = {
            type: "formula",
            id: "formula_eqn1",
            label: "(1)",
            content: "<mml:mrow>...</mml:mrow>",
            format: "mathml"
        },
        (o.Prototype = function() {
            this.inline = !1
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constuctor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    213: [function(t, e, n) {
        "use strict";
        var i = t("lens/article/nodes/node").View
          , o = function(t, e) {
            i.call(this, t, e)
        };
        (o.Prototype = function() {
            var t = {
                latex: "math/tex",
                mathml: "math/mml"
            }
              , e = {
                image: 0,
                mathml: 1,
                latex: 2
            };
            this.render = function() {
                this.node.inline && this.$el.addClass("inline");
                var n, i = [];
                for (n = 0; n < this.node.data.length; n++)
                    i.push({
                        format: this.node.format[n],
                        data: this.node.data[n]
                    });
                if (i.sort(function(t, n) {
                    return e[t.format] - e[n.format]
                }),
                i.length > 0) {
                    var o = !1
                      , r = !1;
                    for (n = 0; n < i.length; n++) {
                        var s = i[n].format
                          , a = i[n].data;
                        switch (s) {
                        case "mathml":
                            r || (this.$el.append($(a)),
                            r = !0,
                            o && (this.$preview.hide(),
                            o = !0));
                            break;
                        case "latex":
                            if (!r) {
                                var c = t[s];
                                this.node.inline || (c += "; mode=display");
                                var l = $("<script>").attr("type", c).html(a);
                                this.$el.append(l),
                                r = !0
                            }
                            break;
                        case "image":
                            if (!o) {
                                var u = $("<div>").addClass("MathJax_Preview");
                                u.append($("<img>").attr("src", a)),
                                this.$el.append(u),
                                this.$preview = u,
                                o = !0
                            }
                            break;
                        default:
                            console.error("Unknown formula format:", s)
                        }
                    }
                }
                return this.node.label && this.$el.append($('<div class="label">').html(this.node.label)),
                this
            }
        }
        ).prototype = i.prototype,
        o.prototype = new o.Prototype,
        e.exports = o
    }
    , {
        "lens/article/nodes/node": 90
    }],
    214: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./formula"),
            View: t("./formula_view")
        }
    }
    , {
        "./formula": 212,
        "./formula_view": 213
    }],
    215: [function(t, e, n) {
        t("underscore");
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Node.call(this, t, e)
        };
        o.type = {
            id: "html_table",
            parent: "content",
            properties: {
                source_id: "string",
                label: "string",
                content: "string",
                footer: "table-wrap-foot",
                caption: "caption"
            }
        },
        o.config = {
            zoomable: !0
        },
        o.description = {
            name: "HTMLTable",
            remarks: ["A table figure which is expressed in HTML notation"],
            properties: {
                source_id: "string",
                label: "Label shown in the resource header.",
                title: "Full table title",
                content: "HTML data",
                footers: "HTMLTable footers expressed as an array strings",
                caption: "References a caption node, that has all the content"
            }
        },
        o.example = {
            id: "html_table_1",
            type: "html_table",
            label: "HTMLTable 1.",
            title: "Lorem ipsum table",
            content: "<table>...</table>",
            footers: [],
            caption: "caption_1"
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.tables.length > 0 && t.push(...this.properties.tables),
                this.properties.footer && t.push(this.properties.footer),
                t
            }
            ,
            this.getCaption = function() {
                if (this.properties.caption)
                    return this.document.get(this.properties.caption)
            }
            ,
            this.getHeader = function() {
                return this.properties.label
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171,
        underscore: 183
    }],
    216: [function(t, e, n) {
        "use strict";
        var i = t("underscore")
          , o = t("../node").View
          , r = t("lens/substance/application").$$
          , s = t("lens/article/resource_view")
          , a = function(t, e, n) {
            o.call(this, t, e),
            this.childrenViews = [],
            s.call(this, n)
        };
        (a.Prototype = function() {
            i.extend(this, s.prototype),
            this.isZoomable = !0,
            this.renderBody = function() {
                this.renderChildren();
                var t = r(".footers", {
                    children: i.map(this.node.footers, function(t) {
                        return r(".footer", {
                            html: "<b>" + t.label + "</b> " + t.content
                        })
                    })
                });
                if (this.node.caption) {
                    var e = this.createView(this.node.caption);
                    this.content.appendChild(e.render().el)
                }
                this.content.appendChild(t)
            }
            ,
            this.renderChildren = function() {
                for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
                    var n = this.createChildView(t[e]).render().el;
                    this.content.appendChild(n)
                }
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = o.prototype,
        a.prototype = new a.Prototype,
        e.exports = a
    }
    , {
        "../node": 219,
        "lens/article/resource_view": 125,
        "lens/substance/application": 158,
        underscore: 183
    }],
    217: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./html_table"),
            View: t("./html_table_view")
        }
    }
    , {
        "./html_table": 215,
        "./html_table_view": 216
    }],
    218: [function(t, e, n) {
        e.exports = {
            citation: t("./citation"),
            cover: t("./cover"),
            figure: t("./figure"),
            caption: t("./caption"),
            attrib: t("./attrib"),
            formula: t("./formula"),
            html_table: t("./html_table"),
            table: t("./table"),
            colgroup: t("./colgroup"),
            thead: t("./thead"),
            tbody: t("./tbody"),
            tr: t("./tr"),
            td: t("./td"),
            th: t("./th"),
            node: t("./node"),
            composite: t("./composite"),
            table_wrap_foot: t("./table_wrap_foot"),
            footnote_reference: t("./footnote_reference"),
            annotation: t("./annotation")
        }
    }
    , {
        "./annotation": 190,
        "./attrib": 193,
        "./caption": 196,
        "./citation": 199,
        "./colgroup": 202,
        "./composite": 204,
        "./cover": 206,
        "./figure": 209,
        "./footnote_reference": 211,
        "./formula": 214,
        "./html_table": 217,
        "./node": 219,
        "./table": 222,
        "./table_wrap_foot": 225,
        "./tbody": 228,
        "./td": 231,
        "./th": 234,
        "./thead": 237,
        "./tr": 240
    }],
    219: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./node"),
            View: t("./node_view")
        }
    }
    , {
        "./node": 220,
        "./node_view": 221
    }],
    220: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document").Node;
        i.description = {
            name: "Node",
            remarks: ["Abstract node type."],
            properties: {
                source_id: "Useful for document conversion where the original id of an element should be remembered."
            }
        },
        e.exports = i
    }
    , {
        "lens/substance/document": 171
    }],
    221: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/application").View
          , o = t("lens/article/nodes/text/text_property_view")
          , r = function(t, e, n) {
            if (i.call(this, n),
            this.node = t,
            this.viewFactory = e,
            !e)
                throw new Error('Illegal argument. Argument "viewFactory" is mandatory.');
            this.$el.addClass("content-node").addClass(t.type.replace("_", "-")),
            this.el.dataset.id = this.node.id
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.content = document.createElement("DIV"),
                this.content.classList.add("content"),
                this.focusHandle = document.createElement("DIV"),
                this.focusHandle.classList.add("focus-handle"),
                this.el.appendChild(this.content),
                this.el.appendChild(this.focusHandle),
                this
            }
            ,
            this.dispose = function() {
                this.stopListening()
            }
            ,
            this.createView = function(t) {
                var e = this.node.document.get(t);
                return this.viewFactory.createView(e)
            }
            ,
            this.createTextView = function(t) {
                return console.error("FIXME: NodeView.createTextView() is deprecated. Use NodeView.createTextPropertyView() instead."),
                this.viewFactory.createView(this.node, t, "text")
            }
            ,
            this.createTextPropertyView = function(t, e) {
                return new o(this.node.document,t,this.viewFactory,e)
            }
            ,
            this.renderAnnotatedText = function(t, e) {
                return o.renderAnnotatedText(this.node.document, t, e, this.viewFactory)
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "lens/article/nodes/text/text_property_view": 116,
        "lens/substance/application": 158
    }],
    222: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./table"),
            View: t("./table_view")
        }
    }
    , {
        "./table": 223,
        "./table_view": 224
    }],
    223: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "table",
            parent: "content",
            properties: {
                source_id: "string",
                colgroup: "colgroup",
                thead: "thead",
                tbody: "tbody"
            }
        },
        o.description = {
            name: "Table",
            remarks: ["...", "..."],
            properties: {
                title: "Attrib title (optional)"
            }
        },
        o.example = {
            id: "attrib_1"
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.colgroup && t.push(this.properties.colgroup),
                this.properties.thead && t.push(this.properties.thead),
                this.properties.tbody && t.push(this.properties.tbody),
                t
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    224: [function(t, e, n) {
        "use strict";
        var i = t("../composite").View
          , o = t("lens/substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.content = o(".table-wrapper"),
                this.child = o("table"),
                this.renderChildren(),
                this.content.appendChild(this.child),
                this.el.appendChild(this.content),
                this
            }
            ,
            this.renderChildren = function() {
                for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
                    var n = this.createChildView(t[e]).render().el;
                    this.child.appendChild(n.childNodes[0])
                }
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../composite": 204,
        "lens/substance/application": 158
    }],
    225: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./table_wrap_foot"),
            View: t("./table_wrap_foot_view")
        }
    }
    , {
        "./table_wrap_foot": 226,
        "./table_wrap_foot_view": 227
    }],
    226: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "table-wrap-foot",
            parent: "html_table",
            properties: {
                source_id: "string",
                fn: ["array", "fn"]
            }
        },
        o.description = {
            name: "TableWrapFoot",
            remarks: ["...", "..."],
            properties: {
                title: "Attrib title (optional)"
            }
        },
        o.example = {
            id: "attrib_1",
            content: "<TableWrapFoot>...</TableWrapFoot>"
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.fn && (t = this.properties.fn),
                t
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    227: [function(t, e, n) {
        "use strict";
        var i = t("../composite").View
          , o = t("lens/substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.content = o("div.table-wrap-foot"),
                this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
            ,
            this.renderChildren = function() {
                for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
                    var n = this.createChildView(t[e]).render().el;
                    this.content.appendChild(n)
                }
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../composite": 204,
        "lens/substance/application": 158
    }],
    228: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./tbody"),
            View: t("./tbody_view")
        }
    }
    , {
        "./tbody": 229,
        "./tbody_view": 230
    }],
    229: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "tbody",
            parent: "table",
            properties: {
                source_id: "string",
                tr: ["array", "tr"]
            }
        },
        o.description = {
            name: "Tbody",
            remarks: ["...", "..."],
            properties: {
                title: "Attrib title (optional)"
            }
        },
        o.example = {
            id: "attrib_1",
            content: "<tbody>...</tbody>"
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.tr && (t = this.properties.tr),
                t
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    230: [function(t, e, n) {
        "use strict";
        var i = t("../composite").View
          , o = t("lens/substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.content = o("tbody.table-wrapper-tbody"),
                this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
            ,
            this.renderChildren = function() {
                for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
                    var n = this.createChildView(t[e]).render().el;
                    this.content.appendChild(n.childNodes[0])
                }
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../composite": 204,
        "lens/substance/application": 158
    }],
    231: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./td"),
            View: t("./td_view")
        }
    }
    , {
        "./td": 232,
        "./td_view": 233
    }],
    232: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "td",
            parent: "tr",
            properties: {
                source_id: "string",
                description: "paragraph"
            }
        },
        o.description = {
            name: "TdNode",
            remarks: ["Can either be expressed in MathML format or using an image url"],
            properties: {
                description: "description of the row"
            }
        },
        o.example = {
            type: "tr",
            id: "tr_eqn1",
            label: "(1)",
            description: "...",
            format: "mathml"
        },
        (o.Prototype = function() {
            this.getDescription = function() {
                if (this.properties.description)
                    return this.document.get(this.properties.description)
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constuctor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    233: [function(t, e, n) {
        "use strict";
        var i = t("../composite").View
          , o = t("underscore")
          , r = t("../node").View
          , s = t("lens/article").ResourceView
          , a = t("lens/substance/application").$$
          , c = function(t, e, n) {
            i.call(this, t, e),
            (n = n || {}).elementType = "td",
            r.call(this, t, e, n),
            s.call(this, n)
        };
        (c.Prototype = function() {
            o.extend(this, s.prototype),
            this.render = function() {
                if (this.content = a("td.table-td"),
                this.node.getDescription()) {
                    var t = this.createChildView(this.node.description).render().el;
                    this.content.appendChild(t)
                }
                return this.el.appendChild(this.content),
                this
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = r.prototype,
        c.prototype = new c.Prototype,
        e.exports = c
    }
    , {
        "../composite": 204,
        "../node": 219,
        "lens/article": 5,
        "lens/substance/application": 158,
        underscore: 183
    }],
    234: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./th"),
            View: t("./th_view")
        }
    }
    , {
        "./th": 235,
        "./th_view": 236
    }],
    235: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "th",
            parent: "tr",
            properties: {
                source_id: "string",
                description: "paragraph"
            }
        },
        o.description = {
            name: "ThNode",
            remarks: ["Can either be expressed in MathML format or using an image url"],
            properties: {
                description: "description of the row"
            }
        },
        o.example = {
            type: "tr",
            id: "tr_eqn1",
            label: "(1)",
            description: "...",
            format: "mathml"
        },
        (o.Prototype = function() {
            this.getDescription = function() {
                if (this.properties.description)
                    return this.document.get(this.properties.description)
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constuctor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    236: [function(t, e, n) {
        "use strict";
        var i = t("../composite").View
          , o = t("underscore")
          , r = t("../node").View
          , s = t("lens/article").ResourceView
          , a = t("lens/substance/application").$$
          , c = function(t, e, n) {
            i.call(this, t, e),
            (n = n || {}).elementType = "td",
            r.call(this, t, e, n),
            s.call(this, n)
        };
        (c.Prototype = function() {
            o.extend(this, s.prototype),
            this.render = function() {
                if (this.content = a("th.table-th"),
                this.node.getDescription()) {
                    var t = this.createChildView(this.node.description).render().el;
                    this.content.appendChild(t)
                }
                return this.el.appendChild(this.content),
                this
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = r.prototype,
        c.prototype = new c.Prototype,
        e.exports = c
    }
    , {
        "../composite": 204,
        "../node": 219,
        "lens/article": 5,
        "lens/substance/application": 158,
        underscore: 183
    }],
    237: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./thead"),
            View: t("./thead_view")
        }
    }
    , {
        "./thead": 238,
        "./thead_view": 239
    }],
    238: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "thead",
            parent: "table",
            properties: {
                source_id: "string",
                tr: ["string", "tr"]
            }
        },
        o.description = {
            name: "Thead",
            remarks: ["...", "..."],
            properties: {
                title: "Attrib title (optional)"
            }
        },
        o.example = {
            id: "attrib_1",
            content: "<thead>...</thead>"
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.tr && (t = this.properties.tr),
                t
            }
        }
        ).prototype = i.Composite.prototype,
        (o.prototype = new o.Prototype).constructor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    239: [function(t, e, n) {
        "use strict";
        var i = t("../composite").View
          , o = t("lens/substance/application").$$
          , r = function(t, e) {
            i.call(this, t, e)
        };
        (r.Prototype = function() {
            this.render = function() {
                return this.content = o("thead.table-thead"),
                this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
            ,
            this.renderChildren = function() {
                for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
                    var n = this.createChildView(t[e]).render().el;
                    this.content.appendChild(n.childNodes[0])
                }
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = i.prototype,
        r.prototype = new r.Prototype,
        e.exports = r
    }
    , {
        "../composite": 204,
        "lens/substance/application": 158
    }],
    240: [function(t, e, n) {
        "use strict";
        e.exports = {
            Model: t("./tr"),
            View: t("./tr_view")
        }
    }
    , {
        "./tr": 241,
        "./tr_view": 242
    }],
    241: [function(t, e, n) {
        "use strict";
        var i = t("lens/substance/document")
          , o = function(t, e) {
            i.Composite.call(this, t, e)
        };
        o.type = {
            id: "tr",
            parent: "tbody",
            properties: {
                source_id: "string",
                td: ["string", "td"],
                th: ["string", "th"]
            }
        },
        o.description = {
            name: "TrNode",
            remarks: ["Can either be expressed in MathML format or using an image url"],
            properties: {
                content: "content of the row"
            }
        },
        o.example = {
            type: "tr",
            id: "tr_eqn1",
            label: "(1)",
            content: "<mml:mrow>...</mml:mrow>",
            format: "mathml"
        },
        (o.Prototype = function() {
            this.getChildrenIds = function() {
                var t = [];
                return this.properties.td.length > 0 ? t.push(...this.properties.td) : this.properties.th.length > 0 && t.push(...this.properties.th),
                t
            }
        }
        ).prototype = i.Node.prototype,
        (o.prototype = new o.Prototype).constuctor = o,
        i.Node.defineProperties(o),
        e.exports = o
    }
    , {
        "lens/substance/document": 171
    }],
    242: [function(t, e, n) {
        "use strict";
        var i = t("../composite").View
          , o = t("underscore")
          , r = t("../node").View
          , s = t("lens/article").ResourceView
          , a = t("lens/substance/application").$$
          , c = function(t, e, n) {
            i.call(this, t, e),
            (n = n || {}).elementType = "tr",
            r.call(this, t, e, n),
            s.call(this, n)
        };
        (c.Prototype = function() {
            o.extend(this, s.prototype),
            this.render = function() {
                return this.content = a("tr"),
                this.renderChildren(),
                this.el.appendChild(this.content),
                this
            }
            ,
            this.renderChildren = function() {
                for (var t = this.node.getChildrenIds(), e = 0; e < t.length; e++) {
                    var n = this.createChildView(t[e]).render().el;
                    this.content.appendChild(n.childNodes[0])
                }
            }
            ,
            this.createChildView = function(t) {
                var e = this.createView(t);
                return this.childrenViews.push(e),
                e
            }
        }
        ).prototype = r.prototype,
        c.prototype = new c.Prototype,
        e.exports = c
    }
    , {
        "../composite": 204,
        "../node": 219,
        "lens/article": 5,
        "lens/substance/application": 158,
        underscore: 183
    }],
    243: [function(t, e, n) {
        "use strict";
        var i = t("lens/reader")
          , o = t("lens/converter")
          , r = t("./sps_converter")
          , s = function(t) {
            i.call(this, t)
        };
        (s.Prototype = function() {
            this.getConverters = function(t) {
                return [new r(t), new o(t)]
            }
        }
        ).prototype = i.prototype,
        (s.prototype = new s.Prototype).constructor = s,
        e.exports = s
    }
    , {
        "./sps_converter": 244,
        "lens/converter": 127,
        "lens/reader": 131
    }],
    244: [function(t, e, n) {
        "use strict";
        var i = new (t("./get_locale.js"))
          , o = t("lens/converter")
          , r = t("underscore")
          , s = t("lens/substance/util")
          , a = t("lens/article")
          , c = t("./nodes")
          , l = function(t) {
            o.call(this, t)
        };
        (l.Prototype = function() {
            this._annotationTypes = {
                bold: "strong",
                italic: "emphasis",
                monospace: "code",
                sub: "subscript",
                sup: "superscript",
                sc: "custom_annotation",
                roman: "custom_annotation",
                "sans-serif": "custom_annotation",
                "styled-content": "custom_annotation",
                underline: "underline",
                "ext-link": "link",
                xref: "",
                email: "link",
                "named-content": "",
                "inline-formula": "inline-formula",
                uri: "link"
            },
            this.test = function(t) {
                var e = t.querySelector("article").getAttribute("specific-use");
                if ("string" == typeof e && "sps" == e.split("-", 2)[0])
                    return !0;
                return !1
            }
            ,
            this._contribTypeMapping = i._contribTypeMapping,
            this.createDocument = function() {
                return new a({
                    nodeTypes: c
                })
            }
            ,
            this.resolveURL = function(t, e) {
                return e.match(/http:/) ? e : [t.options.baseURL, e].join("")
            }
            ,
            this.citationTypes = {
                "mixed-citation": !0,
                "element-citation": !1
            },
            this.paragraph = function(t, e) {
                var n = t.doc;
                t.skipWS = !0;
                for (var i = {
                    id: t.nextId("paragraph"),
                    type: "paragraph",
                    children: null
                }, o = [], a = new s.dom.ChildNodeIterator(e); a.hasNext(); ) {
                    var c = a.next()
                      , l = s.dom.getNodeType(c);
                    if ("text" === l || this.isAnnotation(l) || this.isInlineNode(l)) {
                        var u = {
                            id: t.nextId("text"),
                            type: "text",
                            content: null
                        };
                        t.stack.push({
                            path: [u.id, "content"]
                        });
                        var p = this._annotatedText(t, a.back(), {
                            offset: 0,
                            breakOnUnknown: !1
                        });
                        p.length > 0 && (u.content = p,
                        n.create(u),
                        o.push(u)),
                        t.stack.pop()
                    } else if ("inline-graphic" === l) {
                        var h = c.getAttribute("xlink:href")
                          , d = {
                            id: t.nextId("image"),
                            type: "image",
                            url: this.resolveURL(t, h)
                        };
                        n.create(d),
                        o.push(d)
                    } else if ("inline-formula" === l) {
                        var f = this.formula(t, c, "inline");
                        f && o.push(f)
                    }
                }
                return 0 === o.length ? null : (i.children = r.map(o, function(t) {
                    return t.id
                }),
                n.create(i),
                i)
            }
            ,
            this.ref = function(t, e) {
                for (var n = s.dom.getChildren(e), i = 0; i < n.length; i++)
                    if ("element-citation" === s.dom.getNodeType(n[i]))
                        var o = n[i].getAttribute("publication-type");
                for (i = 0; i < n.length; i++)
                    "mixed-citation" === s.dom.getNodeType(n[i]) && this.citation(t, e, n[i], o)
            }
            ,
            this.citation = function(t, e, n, i) {
                var o, r = t.doc, s = t.nextId("article_citation");
                return o = {
                    id: s,
                    source_id: e.getAttribute("id"),
                    type: "citation",
                    citation_text: n.textContent,
                    publication_type: i
                },
                r.create(o),
                r.show("citations", s),
                o
            }
            ,
            this.appGroup = function(t, e) {
                var n = e.querySelectorAll("app");
                if (0 !== n.length) {
                    var i = t.doc
                      , o = e.querySelector("title");
                    o || console.error("FIXME: every app should have a title", this.toHtml(o));
                    var s = t.nextId("heading")
                      , a = i.create({
                        type: "heading",
                        id: s,
                        level: 1,
                        content: "Appendices"
                    });
                    this.show(t, [a]),
                    r.each(n, function(e) {
                        t.sectionLevel = 2,
                        this.app(t, e)
                    }
                    .bind(this))
                }
            }
            ,
            this.attrib = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("attrib"),
                    source_id: e.getAttribute("id"),
                    type: "attrib",
                    description: "",
                    children: []
                }
                  , o = e;
                if (o) {
                    var s = this.paragraph(t, o);
                    s && (i.description = s.id)
                }
                var a = []
                  , c = e.querySelectorAll("p");
                return r.each(c, function(n) {
                    if (n.parentNode === e) {
                        var i = this.paragraph(t, n);
                        i && a.push(i.id)
                    }
                }, this),
                i.children = a,
                n.create(i),
                i
            }
            ,
            this.table = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("table"),
                    source_id: e.getAttribute("id"),
                    type: "table",
                    colgroup: null,
                    thead: null,
                    tbody: null
                }
                  , o = e.querySelector("colgroup");
                if (o) {
                    var r = this.colgroup(t, o);
                    r && (i.colgroup = r.id)
                }
                var s = e.querySelector("thead");
                if (s) {
                    var a = this.thead(t, s);
                    a && (i.thead = a.id)
                }
                var c = e.querySelector("tbody");
                if (c) {
                    var l = this.tbody(t, c);
                    l && (i.tbody = l.id)
                }
                return n.create(i),
                i
            }
            ,
            this.colgroup = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("colgroup"),
                    source_id: e.getAttribute("id"),
                    type: "colgroup",
                    content: ""
                };
                return i.content = this.toHtml(e),
                n.create(i),
                i
            }
            ,
            this.thead = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("thead"),
                    source_id: e.getAttribute("id"),
                    type: "thead",
                    tr: []
                };
                i.content = this.toHtml(e);
                var o = e.querySelectorAll("tr");
                return o.length > 0 && o.forEach(e=>{
                    var n = this.tr(t, e);
                    n && i.tr.push(n.id)
                }
                ),
                n.create(i),
                i
            }
            ,
            this.th = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("th"),
                    source_id: e.getAttribute("id"),
                    type: "th",
                    description: ""
                };
                if (e) {
                    var o = this.paragraph(t, e);
                    o && (i.description = o.id)
                }
                return n.create(i),
                i
            }
            ,
            this.td = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("td"),
                    source_id: e.getAttribute("id"),
                    type: "td",
                    description: ""
                };
                if (e) {
                    var o = this.paragraph(t, e);
                    o && (i.description = o.id)
                }
                return n.create(i),
                i
            }
            ,
            this.tr = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("tr"),
                    source_id: e.getAttribute("id"),
                    type: "tr",
                    td: [],
                    th: []
                }
                  , o = e.querySelectorAll("td");
                o.length > 0 && o.forEach(e=>{
                    var n = this.td(t, e);
                    n && i.td.push(n.id)
                }
                );
                var r = e.querySelectorAll("th");
                return r.length > 0 && r.forEach(e=>{
                    var n = this.th(t, e);
                    n && i.th.push(n.id)
                }
                ),
                n.create(i),
                i
            }
            ,
            this.tbody = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("tbody"),
                    source_id: e.getAttribute("id"),
                    type: "tbody",
                    tr: []
                }
                  , o = e.querySelectorAll("tr");
                return o.length > 0 && o.forEach(e=>{
                    var n = this.tr(t, e);
                    n && i.tr.push(n.id)
                }
                ),
                n.create(i),
                i
            }
            ,
            this.figure = function(t, e) {
                var n = t.doc
                  , i = {
                    type: "figure",
                    id: t.nextId("figure"),
                    source_id: e.getAttribute("id"),
                    label: "Figure",
                    url: "",
                    caption: null,
                    attrib: null
                }
                  , o = e.querySelector("label");
                o && (i.label = this.annotatedText(t, o, [i.id, "label"]));
                var r = e.querySelector("caption");
                if (r) {
                    var s = this.caption(t, r);
                    s && (i.caption = s.id)
                }
                var a = e.querySelectorAll("attrib");
                a.length > 0 && (i.attrib = [],
                a.forEach(e=>{
                    var n = this.attrib(t, e);
                    n && i.attrib.push(n.id)
                }
                ));
                var c = e.getAttribute("position");
                return c && (i.position = c || ""),
                this.enhanceFigure(t, i, e),
                n.create(i),
                e._converted = !0,
                i
            }
            ,
            this._annotatedText = function(t, e, n) {
                for (var i = "", o = void 0 === n.offset ? 0 : n.offset, r = !!n.nested, a = !!n.breakOnUnknown; e.hasNext(); ) {
                    var c = e.next();
                    if (c.nodeType === Node.TEXT_NODE) {
                        var l = t.acceptText(c.textContent);
                        i += l,
                        o += l.length
                    } else {
                        var u, p = s.dom.getNodeType(c);
                        if (this.isAnnotation(p)) {
                            if (t.top().ignore.indexOf(p) < 0) {
                                var h = o;
                                i += u = this._annotationTextHandler[p] ? this._annotationTextHandler[p].call(this, t, c, p, o) : this._getAnnotationText(t, c, p, o),
                                o += u.length,
                                t.ignoreAnnotations || this.createAnnotation(t, c, h, o)
                            }
                        } else if (this.isInlineNode(p))
                            i += " ",
                            this.createInlineNode(t, c, o);
                        else if (a) {
                            if (!r) {
                                e.back();
                                break
                            }
                            console.error("Node not supported in annoted text: " + p + "\n" + c.outerHTML)
                        } else
                            t.top().ignore.indexOf(p) < 0 && (i += u = this._getAnnotationText(t, c, p, o),
                            o += u.length)
                    }
                }
                return i
            }
            ,
            this.footnote = function(t, e) {
                var n = t.doc
                  , i = {
                    type: "footnote",
                    id: t.nextId("fn"),
                    source_id: e.getAttribute("id"),
                    label: "",
                    children: []
                }
                  , o = e.children
                  , s = 0;
                for ("label" === o[0].tagName.toLowerCase() && (i.label = this.annotatedText(t, o[0], [i.id, "label"]),
                s++),
                i.children = []; s < o.length; s++) {
                    var a = this.paragraphGroup(t, o[s]);
                    Array.prototype.push.apply(i.children, r.pluck(a, "id"))
                }
                return n.create(i),
                e.__converted__ = !0,
                i
            }
            ,
            this.tableWrapFoot = function(t, e) {
                var n = t.doc
                  , i = {
                    id: t.nextId("table-wrap-foot"),
                    source_id: e.getAttribute("id"),
                    type: "table_wrap_foot",
                    fn: []
                };
                return n.create(i),
                i
            }
            ,
            this.tableWrap = function(t, e) {
                var n = t.doc
                  , i = e.querySelector("label")
                  , o = {
                    id: t.nextId("html_table"),
                    source_id: e.getAttribute("id"),
                    type: "html_table",
                    title: "",
                    label: i ? i.textContent : "Table",
                    content: "",
                    caption: null,
                    tables: null,
                    footer: null
                }
                  , r = e.querySelectorAll("table");
                r && (o.tables = [],
                r.forEach(e=>{
                    var n = this.table(t, e);
                    n && o.tables.push(n.id)
                }
                ));
                var s = e.querySelector("table-wrap-foot");
                if (s) {
                    var a = this.tableWrapFoot(t, s);
                    a && (o.footer = a.id)
                }
                return this.extractTableCaption(t, o, e),
                this.enhanceTable(t, o, e),
                n.create(o),
                o
            }
            ,
            this._getFormulaData = function(t) {
                for (var e = [], n = t.firstElementChild; n; n = n.nextElementSibling) {
                    var i = s.dom.getNodeType(n);
                    if ("alternatives" == i) {
                        var o = r.find(n.children, t=>"mml:math" == t.tagName);
                        o ? (n = o,
                        i = "mml:math") : (o = r.find(n.children, t=>"graphic" == t.tagName)) && (n = o,
                        i = "graphic")
                    }
                    switch (i) {
                    case "graphic":
                    case "inline-graphic":
                        e.push({
                            format: "image",
                            data: n.getAttribute("xlink:href")
                        });
                        break;
                    case "svg":
                        e.push({
                            format: "svg",
                            data: this.toHtml(n)
                        });
                        break;
                    case "mml:math":
                    case "math":
                        e.push({
                            format: "mathml",
                            data: this.mmlToHtmlString(n)
                        });
                        break;
                    case "tex-math":
                        e.push({
                            format: "latex",
                            data: n.textContent
                        });
                        break;
                    case "label":
                        break;
                    case "alternatives":
                        for (let t of n.children)
                            "mml:math" == t.tagName ? e.push({
                                format: "mathml",
                                data: this.mmlToHtmlString(t)
                            }) : "graphic" == t.tagName && e.push({
                                format: "image",
                                data: t.getAttribute("xlink:href")
                            });
                        break;
                    default:
                        console.error("Unsupported formula element of type " + i)
                    }
                }
                return e
            }
        }
        ).prototype = o.prototype,
        (l.prototype = new l.Prototype).constructor = l,
        e.exports = l
    }
    , {
        "./get_locale.js": 185,
        "./nodes": 218,
        "lens/article": 5,
        "lens/converter": 127,
        "lens/substance/util": 180,
        underscore: 183
    }]
}, {}, [1]);
