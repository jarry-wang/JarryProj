let col1H = 0;
let col2H = 0;
var Bmob = require('../../utils/bmob.js');
var that;
Page({

    data: {
        scrollH: 0,
        imgWidth: 0,
        loadingCount: 0,
        images: [],
        imageUrls:[],
        col1: [],
        col2: [],
        poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
        name: '特别的人',
        author: '方大同',
        src: 'http://7xjope.com1.z0.glb.clouddn.com/%E7%89%B9%E5%88%AB%E7%9A%84%E4%BA%BA%20-%20%E6%96%B9%E5%A4%A7%E5%90%8C.mp3'
    },

    onLoad: function () {
        that = this;
        wx.getSystemInfo({
            success: (res) => {
                let ww = res.windowWidth;
                let wh = res.windowHeight;
                let imgWidth = ww * 0.48;
                let scrollH = wh;

                this.setData({
                    scrollH: scrollH,
                    imgWidth: imgWidth
                });

                this.loadImages();
            }
        })
        this.audioCtx = wx.createAudioContext('myAudio')
    },
    onReady: function( e ) {
        // wx.setNavigationBarTitle( { title: "哎哟不错哦" });
         console.log("onReady");
    
    // this.audioCtx.play()
  
    },
    onShow: function() {
    // Do something when page show.
        console.log("onShow");
        this.audioCtx.play()
    },
    onHide: function() {
        // Do something when page hide.
        console.log("onHide");
        this.audioCtx.pause()
    },


     refresh: function () {
        console.log("refresh");
        this.setData({  
            loadingCount: 0,
            images: [],  
            imageUrls:[],
            col1: [],
            col2: []
        });  
        col1H = 0;
        col2H = 0;
        this.loadImages();
     },

    onImageLoad: function (e) {
        console.log("onImageLoad");
        let imageId = e.currentTarget.id;
        let oImgW = e.detail.width;         //图片原始宽度
        let oImgH = e.detail.height;        //图片原始高度
        let imgWidth = this.data.imgWidth;  //图片设置的宽度
        let scale = imgWidth / oImgW;        //比例计算
        let imgHeight = oImgH * scale;      //自适应高度

        let images = this.data.images;
        let imageObj = null;

        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            if (img.id === imageId) {
                imageObj = img;
                break;
            }
        }

        imageObj.height = imgHeight;

        let loadingCount = this.data.loadingCount - 1;
        let col1 = this.data.col1;
        let col2 = this.data.col2;

        if (col1H <= col2H) {
            col1H += imgHeight;
            col1.push(imageObj);
        } else {
            col2H += imgHeight;
            col2.push(imageObj);
        }

        let data = {
            loadingCount: loadingCount,
            col1: col1,
            col2: col2
        };

        if (!loadingCount) {
            data.images = [];
        }

        this.setData(data);
    },

    loadImages: function () {
      console.log("loadImages");
        let images = [];
        let imageUrls = [];
        var Image = Bmob.Object.extend("pic");
        var query = new Bmob.Query(Image);
        query.descending("createdAt");
        // 查询所有数据
        query.find({
            success: function(results) {
            console.log("共查询到 " + results.length + " 条记录");
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var picObj = {pic: object.get('image')._url, height: 0}
              images.push(picObj);
              imageUrls.push(object.get('image')._url);
            }

              console.log('images.length='+images.length);
              let baseId = "img-" + (+new Date());
              for (let i = 0; i < images.length; i++) {
                  images[i].id = baseId + "-" + i;
              }
             that.setData({
                loadingCount: images.length,
                images: images,
                imageUrls: imageUrls
            });
          },
          error: function(error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });   
        
    },

    seePic: function(event) {
        console.log("查看图片:"+that.data.imageUrls);
        var url = event.currentTarget.dataset.picurl;
        console.log("查看图片:"+url);
        wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: that.data.imageUrls // 需要预览的图片http链接列表
      })
    }

})