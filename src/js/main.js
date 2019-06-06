require.config({
    baseUrl: "/",
    paths: {
        "jquery": "libs/jquery/jquery-3.3.1.min",
        "head": "js/moudle/head",
        "foot": "js/moudle/foot",
        "login": "js/moudle/login",
        "template": "libs/art-template/template-web",
        "Swiper": "libs/swiper/js/swiper",
        "cloudzoom": "libs/cloudzoom/cloudzoom",
        "cartNum": "js/moudle/cartNum",
        "fly": "libs/flyjs/fly.min",
        "flyToCar": "js/moudle/flyToCar",
        "loding": "js/moudle/loding"
    },
    // 垫片，不满足AMD规范的模块，但是又依赖于另外的模块
    shim: {
        "cloudzoom": {
            deps: ["jquery"]
        },
        "fly": {
            deps: ["jquery"]
        },
        "select": {
            deps: ["jquery"]
        },
        "loding": {
            deps: ["jquery"]
        },
    }
})