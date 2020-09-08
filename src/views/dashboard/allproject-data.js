import store from '../../store/index';
import moment from 'moment'
const projectLines = store.state.project.projectLines;

/**
 * @description 配置项-获取产品条线
 * @param {Array} renderData 
 */
export function renderAllProjectDate(renderData) {
  let allProejctDate = projectLines.map(item => ({
    name: item,
    value: 0
  }));
  renderData = renderData.filter(item => !item.isAssist);
  renderData.forEach(item => {
    let renderItem = allProejctDate.find(dataItem => dataItem.name === item.projectLineValue);

    if (renderItem.value || renderItem.value === 0) {
      renderItem.value += 1;
    }
  });
  // allProejctDate 排除掉那些数量为0的项目
  allProejctDate = allProejctDate.filter(item => item.value > 0);

  let bgColor = '#fff';
  let title = '总量';
  let color = ['#810000', '#ff5722', '#FF8352', '#0E7CE2', '#E271DE', '#00FFFF', '#4AEAB0', '#a2d5f2', '#a3d2ca'];
  let echartData = allProejctDate;

  let formatNumber = function (num) {
    let reg = /(?=(\B)(\d{3})+$)/g;
    return num.toString().replace(reg, ',');
  }
  let total = echartData.reduce((a, b) => {
    return a + b.value * 1
  }, 0);

  let option = {
    backgroundColor: bgColor,
    color: color,
    title: [{
      text: '单位：个',
      top: 0,
      left: -5,
      textStyle: {
        fontSize: 14,
        color: '#666666',
        fontWeight: 400
      }
    }],
    legend: {
      orient: 'vertical',
      icon: 'rect',
      x: '80%',
      y: 'center',
      itemWidth: 12,
      itemHeight: 12,
      align: 'left',
      textStyle: {
        rich: {
          name: {
            fontSize: 18
          },
          value: {
            fontSize: 22,
            padding: [0, 5, 0, 15]
          },
          unit: {
            fontSize: 18
          }
        }
      },
      formatter: function (name) {
        let res = echartData.filter(v => v.name === name);
        res = res[0] || {};
        let unit = res.unit || '';
        return '{name|' + name + '}  {value|' + res.value + '}{unit|' + unit + '}'
      }
      // data: legendName
    },
    series: [{
      type: 'pie',
      radius: ['45%', '60%'],
      center: ['50%', '50%'],
      data: echartData,
      hoverAnimation: false,
      itemStyle: {
        normal: {
          borderColor: bgColor,
          borderWidth: 2
        }
      },
      labelLine: {
        normal: {
          length: 20,
          length2: 120,
          lineStyle: {
            color: '#e6e6e6'
          }
        }
      },
      label: {
        normal: {
          formatter: params => {
            return (
              '{icon|●}{name|' + params.name + '}{value|' +
              formatNumber(params.value) + '}'
            );
          },
          padding: [0, -100, 25, -100],
          rich: {
            icon: {
              fontSize: 16
            },
            name: {
              fontSize: 16,
              padding: [0, 10, 0, 4],
              color: '#666666'
            },
            value: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#333333'
            }
          }
        }
      },
    }]
  };

  return option;
}


// 项目预警状态
function projecStatusData(row) {
  if (!row) {
    return ''
  }
  const toDeadLineNum = moment(new Date()).diff(row.endTime, 'days');
  if (toDeadLineNum > 0) {
    return '超期';
  } else if (toDeadLineNum > -6 && toDeadLineNum <= 0) {
    return '临近交付节点';
  } else {
    return '安全';
  }
}

/**
 * @description 配置项-获取dealine图标代码数据
 * @param {Array} renderData 
 */
export function renderDeanlineDate(renderData) {
  let allProejctDate = projectLines.map(item => ({
    product: item,
    '安全': 0,
    '临近交付节点': 0,
    '超期': 0
  }));

  renderData = renderData.filter(item => !item.isAssist);
  renderData.forEach(item => {
    let renderItem = allProejctDate.find(dataItem => dataItem.product === item.projectLineValue);
    if (renderItem) {
      let key = projecStatusData(item);
      renderItem[key] += 1
    }
  });
  allProejctDate = allProejctDate.filter(item =>
    item['安全'] + item['临近交付节点'] + item['超期'] > 0
  );

  let option = {
    legend: {},
    tooltip: {},
    title: [{
      text: '单位：个',
      top: 0,
      left: -5,
      textStyle: {
        fontSize: 14,
        color: '#666666',
        fontWeight: 400
      }
    }],
    dataset: {
      dimensions: ['product', '安全', '临近交付节点', '超期'],
      source: allProejctDate
    },
    color: ['#bfdcae', '#ffd571', '#ec0101'],
    xAxis: {
      type: 'category',
      axisLabel: {
        textStyle: {
          color: '#333'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      z: 10
    },
    yAxis: {
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
    },
    series: [{
        type: 'bar'
      },
      {
        type: 'bar'
      },
      {
        type: 'bar'
      }
    ]
  };

  return option;
}

/**
 * @description 配置项-获取小组项目本周预计工作量数据
 * @param {Array} renderData 
 */
export function renderWorkloadDate(renderData, isOU, groupIndex) {
  // 定义人员数据
  let personData = [];

  // 所有用户
  if (isOU == 1) {
    personData = store.getters.users;
  } else if (isOU == 2) {
    // 非部门
    personData = store.getters.users.filter(item => item.groupIndex == groupIndex);
  } else {
    personData = store.getters.teamUsers;
  }

  personData = personData.filter(({
    teamLeader
  }) => teamLeader != 4);
  personData = personData.map(({
    displayName
  }) => displayName);

  // 定义总量数组
  let totalData = new Array(personData.length).fill(0);

  // 定义渲染数据
  const seriesData = renderData.map(item => {
    // 定义柱形图数据
    let data = new Array(personData.length)
    // 找到对应项目的负责人的下标
    let index = personData.indexOf(item.developer);

    // 如果存在人员下标，则加入数据中
    if (index > -1) {
      data[index] = Number(item.weekTime);
      totalData[index] += Number(item.weekTime);
    }

    return ({
      name: item.projectName,
      type: 'bar',
      stack: '总量',
      label: {
        show: true
      },
      data: data
    });
  });


  // 加入总数
  seriesData.push({
    type: "line",
    symbolSize: 10,
    symbol: 'circle',
    itemStyle: {
      normal: {
        color: "#999",
        label: {
          show: true,
          position: "top",
          formatter: function (p) {
            return p.value > 0 ? (p.value) : '';
          }
        }
      }
    },
    "data": totalData
  });


  let option = {
    tooltip: {
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    dataZoom: {
      type: 'inside',
      maxSpan: 100,
      minSpan: 60,
    },
    color: ['#f5a31a', '#ea907a', '#f9c49a', '#8fcfd1', '#ff4b5c', '#e89f71', '#4e89ae'],
    yAxis: {
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    xAxis: {
      type: 'category',
      data: personData,
      axisLabel: {
        textStyle: {
          color: '#333'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      z: 10
    },
    series: seriesData
  };

  return option;
}
