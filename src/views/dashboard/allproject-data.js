import store from '../../store/index';
import moment from 'moment'
const projectLines = store.state.project.projectLines;

export function renderAllProjectDate(renderData) {
  let allProejctDate = projectLines.map(item => ({
    name: item,
    value: 0
  }));
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
  let color = ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0', '#a2d5f2', '#a3d2ca'];
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
      text: '{name|' + title + '}\n{val|' + formatNumber(total) + '}',
      top: 'center',
      left: 'center',
      textStyle: {
        rich: {
          name: {
            fontSize: 20,
            fontWeight: 'normal',
            color: '#666666',
            padding: [10, 0]
          },
          val: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#333333',
          }
        }
      }
    }, {
      text: '单位：个',
      top: 20,
      left: 20,
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
 * @description 获取dealine图标代码数据
 * @param {Array} renderData 
 */
export function renderDeanlineDate(renderData) {
  let allProejctDate = projectLines.map(item => ({
    product: item,
    '安全': 0,
    '临近交付节点': 0,
    '超期': 0
  }));

  renderData.forEach(item => {
    let renderItem = allProejctDate.find(dataItem => dataItem.product === item.projectLineValue);
    if (renderItem) {
      let key = projecStatusData(item);
      renderItem[key] += 1
    }
  });

  let option = {
    legend: {},
    tooltip: {},
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
