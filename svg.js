/**
 * 
 * @param {DOMElememt} circlePointObj 作为圆心的dom 对像 
 * @param {Number} num // 围绕圆心的节点个数
 * @param {Numder} R // 圆的半径
 * @param { DOMElememt } aroundPoint // 围绕点也可以是已经存在的 dom 节点
 */


function moveAscircle(centrePoint, pointNum, R, controlBtn, parent, aroundPoint) {
    this.R = R;  
    this.centrePoint = centrePoint;
    this.pointNum = pointNum;
    this.controlBtn = controlBtn;
    this.timer = null;
    this.parent = parent;
    this.aroundPoint = aroundPoint; // 是 jq 获取的围绕点的数组 如果传入此项，pointNum 必须与 aroundPoint.length 相等
    this.fleg = false; // 标记当前围绕点的运动状态 false(聚合) true(分散)
    this.posObj = this.getPointDistribution(this.pointNum,centrePoint);
    this.posArr = this.posObj.posArr;
    this.move()
}


moveAscircle.prototype.sin = function (angle) {  // 获得正弦值
    return Math.sin( Math.PI * (angle/180) )
}

moveAscircle.prototype.cos = function (angle) { // 获得余弦值
    return Math.cos( Math.PI * (angle / 180) )
}

moveAscircle.prototype.go = function (i,qi) {
    var posArr = this.posArr;
    var circlePos = this.centrePoint;
    var className = ".pos" + i;
    var circlePos = {
        left: (circlePos.left + posArr[i].x) / 2,
        top: (circlePos.top + posArr[i].y) / 2
    }
    pos1 = $(className);
    var R = this.R / 2;
    var x = circlePos.left + R * this.cos(qi + posArr[i].angle);
    var y = circlePos.top + R * this.sin(qi + posArr[i].angle);
    return { x:x,y:y,ele:pos1 }
}

moveAscircle.prototype.getBool = function (arr,bool) {
    if( bool ){
        return arr.every(item => item.fleg)
    }else{
        return arr.every(item => !item.fleg)
    }
}

moveAscircle.prototype.show = function (initAngle) {
    var qi = initAngle || 180;
    var t = this;
    this.timer = setInterval(() => {
        for (var i = 0; i < t.posArr.length; i++) {
            (function (i) {
                if (!t.posArr[i].fleg) { return }
                var posObj = t.go(i,qi);
                posObj.ele.css({ "left": posObj.x, "top": posObj.y });
                posObj.ele.css({ visibility: "visible" })
                if (qi <= 0) {
                    t.posArr[i].fleg = false;
                }
                qi--;
            })(i)
        }
        var aa = t.getBool(t.posArr, false);
        if (aa) {
            clearInterval(t.timer);
            t.fleg = true;
        }
    }, 50);
}

moveAscircle.prototype.hidden = function (initAngle) {
    var qi = initAngle || 0;
    var t = this;
    this.timer = setInterval(() => {
        for (var i = 0; i < t.posArr.length; i++) {
            (function (i) {
                if (t.posArr[i].fleg) { return }
                var posObj = t.go(i,qi);
                posObj.ele.css({ "left": posObj.x, "top": posObj.y });
                if (qi >= 180) {
                    t.posArr[i].fleg = true;
                    posObj.ele.css({ visibility: "hidden" })
                }
                qi++;
            })(i)
        }
        var aa = t.getBool(t.posArr, true)
        if (aa) {
            clearInterval(t.timer);
            t.fleg = false;
        }
    }, 50);
}

moveAscircle.prototype.move = function () {  // 使点开始运动
   this.controlBtn.click(() => {
        clearInterval(this.timer);
        // 初始位置在右侧（圆心）
        if (this.fleg) {
            this.hidden(0)
        } else {
            this.show(180)
        }
    })
}

moveAscircle.prototype.getPointDistribution = function (num, centrePoint) {
    num = num || 6; // 点的数量
    var includedAngle = 360 / num; //两个点的夹角
    // 从 0 开始分布点  角度是按照点的个数平分，从 0 度 计算到 360
    var posArr = [];  // 储存点终点位置的数组
    var eleArr = [];  // 储存创建的元素的数组
    var circlePos1 = this.centrePoint;
    R = this.R
    for (var i = 0; i < num; i++) {
        var everyAngle = 0;
        if (i == 0) {
            everyAngle = i;
        } else {
            everyAngle = i * includedAngle;
        }
        var tmp = {};
        var x = this.cos(everyAngle) * R;  // 终点横坐标相对于圆心的偏移量
        var y = this.sin(everyAngle) * R;  // 终点纵坐标相对于圆心的偏移量
        tmp = {
            x: centrePoint.left + x,  // 终点横坐标
            y: centrePoint.top + y,   // 终点纵坐标
            angle: everyAngle, // 相对于 0 度的偏移角 逆时针转
            fleg: true  // 标志位，标志当前点是处于起点(true)或者终点(false)
        }
        posArr.push(tmp)
        var className = "pos pos" + i;
        if( !this.aroundPoint ){
            var div = $("<div>").addClass(className).css({ left: circlePos1.left, top: circlePos1.top, visibility: "hidden" }); 
            this.parent.append(div);  
        }else{
            this.aroundPoint[i].css({ left: circlePos1.left, top: circlePos1.top, visibility: "hidden" }); // 重新给传入的围绕点定位
        }
    }
    return { posArr};
}// 获得围绕点的终点坐标




























// /**
//  * 
//  * @param {Number} num // 围绕圆心的点的个数
//  * @param {Object} centrePoint // 圆心坐标
//  * @returns {Object} {posArr,eleArr} 点位置及其他信息 创建的对应点元素
//  */
// // 获取每个围绕点的位置及其他信息，并且创建环绕点
// function getPointDistribution(num, centrePoint) {
//     num = num || 6; // 点的数量
//     var includedAngle = 360 / num; //两个点的夹角
//     // 从 0 开始分布点  角度是按照点的个数平分，从 0 度 计算到 360
//     var posArr = [];  // 储存点终点位置的数组
//     var eleArr =[];  // 储存创建的元素的数组
//     R = 50
//     for (var i = 0; i < num; i++) {
//         var everyAngle = 0;
//         if (i == 0) {
//             everyAngle = i;
//         } else {
//             everyAngle = i * includedAngle;
//         }
//         var tmp = {};
//         var x = Math.cos(Math.PI * (everyAngle / 180)) * R;  // 终点横坐标相对于圆心的偏移量
//         var y = Math.sin(Math.PI * (everyAngle / 180)) * R;  // 终点纵坐标相对于圆心的偏移量
//         tmp = {
//             x: centrePoint.left + x,  // 终点横坐标
//             y: centrePoint.top + y,   // 终点纵坐标
//             angle: everyAngle, // 相对于 0 度的偏移角 逆时针转
//             fleg: true  // 标志位，标志当前点是处于起点(true)或者终点(false)
//         }
//         posArr.push(tmp)
//         var className = "pos pos" + i;
//         var div = $("<div>").addClass(className).css({ left: circlePos1.left, top: circlePos1.top, visibility: "hidden" });
//         eleArr.push(div);
//     }

//     return {posArr,eleArr};
// }


