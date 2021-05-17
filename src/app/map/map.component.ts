import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

declare var BMapGL: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  title = 'history-map';

  constructor(private router: Router,
              private http: HttpClient) {
  }

  citys: any;
  cityGeo = new BMapGL.Geocoder();
  map: any;
  point: any;
  area = ['北京市', '天津市', '上海市', '重庆市', '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省'];

  /*  getMD() {
      let day = new Date();
      return (day.getMonth() + 1) + '月' + day.getDate() + '日';
    }*/

  getYMD() {
    let day = new Date();
    return day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate();
  }

  getData() {
    return this.http.get('./assets/data.json').toPromise();
  }

  changeFormat(date) {
    return date.replace(/\-/g, '/');
  }

  formatData(date) {
    const reg = /[^\d]+/g;
    return new Date().getFullYear() + '/' + date.replace(reg, '/').substring(0, date.length - 1);
  }


  async initData() {
    const data: any = await this.getData();
    data.data.forEach(item => {
      item.img = this.formatData(item.img);
    });
    const today = this.getYMD();
    const todayValue = new Date(today).getTime();
    const newDate = data.data.filter(item => {
      return new Date(this.changeFormat(item.img)).getTime() <= todayValue;
    });
    console.log(newDate);
    newDate.forEach(item => {
      if (item.img === today) {
        item.icon = './assets/fire/fireing.png';
      } else {
        item.icon = './assets/fire/fired.png';
      }
    });
    this.citys = newDate;
  }

  setBoundary(area: any[]) {
    area.forEach(item => {
      var bd = new BMapGL.Boundary();
      bd.get(item, (rs) => {
        // console.log('外轮廓：', rs.boundaries[0]);
        // console.log('内镂空：', rs.boundaries[1]);
        var hole = new BMapGL.Polygon(rs.boundaries, {
          strokeColor: '#ffc975',
          strokeWeight: '1',
          fillColor: '#c51b14',
          fillOpacity: 0.6
        });
        this.map.addOverlay(hole);
      });
    });
    const polygon1 = new BMapGL.Polygon([
      new BMapGL.Point(113.87972879187679, 22.421515349786716),
      new BMapGL.Point(114.00780041906182, 22.511580154863363),
      new BMapGL.Point(114.18384218666985, 22.554431183376373),
      new BMapGL.Point(114.47750173970908, 22.558715546257318),
      new BMapGL.Point(114.47365807583861, 22.465857490463765),
      new BMapGL.Point(114.52362626947317, 22.370791521386945),
      new BMapGL.Point(114.52439505857912, 22.143940961184793),
      new BMapGL.Point(114.27071023871717, 22.121736779669767),
      new BMapGL.Point(113.93784474146915, 22.12245322579661),
      new BMapGL.Point(113.83713949471363, 22.169721864904634),
      new BMapGL.Point(113.81868968280799, 22.216974434760093),
      new BMapGL.Point(113.87327039979941, 22.332889718078633),
    ], {
      strokeColor: '#ffc975',
      strokeWeight: '0',
      fillColor: '#c51b14',
      fillOpacity: 0.6
    });
    const polygon2 = new BMapGL.Polygon([
      new BMapGL.Point(113.65011134519077, 22.073191660806),
      new BMapGL.Point(113.65011134519077, 22.162760368347232),
      new BMapGL.Point(113.62253564212999, 22.206055819144296),
      new BMapGL.Point(113.5581950233863, 22.21660325373059),
      new BMapGL.Point(113.54138371849785, 22.19211473373512),
      new BMapGL.Point(113.5571412975133, 22.105501708086347),
      new BMapGL.Point(113.57999004907622, 22.064378507401734)
    ], {
      strokeColor: '#ffc975',
      strokeWeight: '0',
      fillColor: '#c51b14',
      fillOpacity: 0.6
    });
    this.map.addOverlay(polygon1);
    this.map.addOverlay(polygon2);
  }

  async ngOnInit() {
    await this.initData();
    this.map = new BMapGL.Map('container');
    this.point = new BMapGL.Point(112.05376, 32.40669);
    this.map.centerAndZoom(this.point, 5);
    this.map.enableScrollWheelZoom();
    this.map.setTilt(70);
    this.map.setMapStyleV2({
      styleJson: [{
        'featureType': 'districtlabel',
        'elementType': 'labels',
        'stylers': {
          'visibility': 'off'
        }
      }, {
        'featureType': 'districtlabel',
        'elementType': 'labels.icon',
        'stylers': {
          'visibility': 'off'
        }
      }]
    });
    this.setBoundary(this.area);
    this.renderIcon();
  }

  changeToMd(date) {
    const day = new Date(date);
    return (day.getMonth() + 1) + '月' + day.getDate() + '日';
  }

  renderIcon(): void {
    for (let i = 0; i < this.citys.length; i++) {
      this.cityGeo.getPoint(this.citys[i].name, (point) => {
        const pt = new BMapGL.Point(point.lng, point.lat);
        const icon = new BMapGL.Icon(this.citys[i].icon, new BMapGL.Size(40, 40));
        const marker = new BMapGL.Marker3D(pt, Math.round(Math.random()) * 6000, {
          size: 20,
          icon: icon
        });
        marker.addEventListener('click', () => {
          this.router.navigate(['history'], {queryParams: {id: this.changeToMd(this.citys[i].img)}});
        });
        const opts = {
          position: pt, // 指定文本标注所在的地理位置
          offset: new BMapGL.Size(-15, 15) // 设置文本偏移量
        };
        const label = new BMapGL.Label(this.changeToMd(this.citys[i].img), opts);
        label.setStyle({
          color: '#333',
          borderRadius: '0px',
          borderColor: '#ccc',
          padding: '0px',
          fontSize: '10px',
          fontFamily: '微软雅黑'
        });
        label.addEventListener('click', () => {
          this.router.navigate(['history'], {queryParams: {id: this.changeToMd(this.citys[i].img)}});
        });
        this.map.addOverlay(marker);
        this.map.addOverlay(label);
      });
    }
  }


}
