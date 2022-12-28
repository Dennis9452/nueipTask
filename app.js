
process.env.PWD = process.cwd()
var express = require('express');

var app = express();

// Then
app.use(express.static(process.env.PWD + '/public'));
app.set("view engine", "ejs");


var router = express.Router();
router.use(express.json());

// Add headers
router.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use('/',router)

router.get('/',function(req,res){
	res.sendFile('./demo.html', { root: __dirname })
})

router.get('/get_all',function(req, res){
    console.log(req.url)
	var jsonText = {
		"result": [
            {
                "s_sn":"35",
                "cnname":"邱小甘",
                "enname":"Peter",
                "sex":"0",
                "phoneNumber":"0900000000",
                "email":"test00@gmail.com"
            },
            {
                "s_sn":"49",
                "cnname":"蔡凡昕",
                "enname":"Allen",
                "sex":"0",
                "phoneNumber":"0911000000",
                "email":"test01@gmail.com"
            },
            {
                "s_sn":"50",
                "cnname":"趙雪瑜",
                "enname":"Sharon",
                "sex":"0",
                "phoneNumber":"0922000000",
                "email":"test02@gmail.com"
            },
            {
                "s_sn":"51",
                "cnname":"賴佳蓉",
                "enname":"Yoki",
                "sex":"1",
                "phoneNumber":"0933000000",
                "email":"test03@gmail.com"
            }
        ]
	};
	res.send(JSON.stringify(jsonText));
});

router.get('/add',function(req, res){
	var jsonText = {
		"result": [
            {
                "s_sn":"35",
                "cnname":"邱小甘",
                "enname":"Peter",
                "sex":"0",
                "phoneNumber":"0900000000",
                "email":"test00@gmail.com"
            },
            {
                "s_sn":"49",
                "cnname":"蔡凡昕",
                "enname":"Allen",
                "sex":"0",
                "phoneNumber":"0911000000",
                "email":"test01@gmail.com"
            },
            {
                "s_sn":"50",
                "cnname":"趙雪瑜",
                "enname":"Sharon",
                "sex":"0",
                "phoneNumber":"0922000000",
                "email":"test02@gmail.com"
            },
            {
                "s_sn":"51",
                "cnname":"賴佳蓉",
                "enname":"Yoki",
                "sex":"1",
                "phoneNumber":"0933000000",
                "email":"test03@gmail.com"
            },
            {
                "s_sn":"52",
                "cnname":"新增帳號",
                "enname":"NewAccount",
                "sex":"1",
                "phoneNumber":"0944000000",
                "email":"test04@gmail.com"
            }
        ]
	};
	res.send(JSON.stringify(jsonText));
});

router.get('/modify',function(req, res){
	var jsonText = {
		"result": [
            {
                "s_sn":"35",
                "cnname":"邱小甘",
                "enname":"Peter",
                "sex":"0",
                "phoneNumber":"0900000000",
                "email":"test00@gmail.com"
            },
            {
                "s_sn":"49",
                "cnname":"蔡凡昕",
                "enname":"Allen",
                "sex":"0",
                "phoneNumber":"0911000000",
                "email":"test01@gmail.com"
            },
            {
                "s_sn":"51",
                "cnname":"賴佳蓉",
                "enname":"Yoki",
                "sex":"1",
                "phoneNumber":"0933000000",
                "email":"test03@gmail.com"
            }
        ]
	};
	res.send(JSON.stringify(jsonText));
});

router.get('/delete',function(req, res){
	var jsonText = {
		"result": [
            {
                "s_sn":"35",
                "cnname":"邱小甘",
                "enname":"Peter",
                "sex":"0",
                "phoneNumber":"0900000000",
                "email":"test00@gmail.com"
            },
            {
                "s_sn":"49",
                "cnname":"蔡凡昕",
                "enname":"Allen",
                "sex":"0",
                "phoneNumber":"0911000000",
                "email":"test01@gmail.com"
            },
        ]
	};
	res.send(JSON.stringify(jsonText));
});


app.listen(8800, function () {
  console.log('Example app listening on port 8800!');
});
