const service ="https://api.fentuapp.vip/index/";

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const toZhDigit = digit =>{
    digit = typeof digit === 'number' ? String(digit) : digit;
    const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const unit = ['千', '百', '十', ''];
    const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
    let breakLen = Math.ceil(digit.length / 4);
    let notBreakSegment = digit.length % 4 || 4;
    let segment;
    let zeroFlag = [], allZeroFlag = [];
    let result = '';

    while (breakLen > 0) {
      if (!result) { // 第一次执行
        segment = digit.slice(0, notBreakSegment);
        let segmentLen = segment.length;
        for (let i = 0; i < segmentLen; i++) {
          if (segment[i] != 0) {
            if (zeroFlag.length > 0) {
              result += '零' + zh[segment[i]] + unit[4 - segmentLen + i];
              // 判断是否需要加上 quot 单位
              if (i === segmentLen - 1 && breakLen > 1) {
                result += quot[breakLen - 2];
              }
              zeroFlag.length = 0;
            } else {
              result += zh[segment[i]] + unit[4 - segmentLen + i];
              if (i === segmentLen - 1 && breakLen > 1) {
                result += quot[breakLen - 2];
              }
            }
          } else {
            // 处理为 0 的情形
            if (segmentLen == 1) {
              result += zh[segment[i]];
              break;
            }
            zeroFlag.push(segment[i]);
            continue;
          }
        }
      } else {
        segment = digit.slice(notBreakSegment, notBreakSegment + 4);
        notBreakSegment += 4;

        for (let j = 0; j < segment.length; j++) {
          if (segment[j] != 0) {
            if (zeroFlag.length > 0) {
              // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
              if (j === 0) {
                result += quot[breakLen - 1] + zh[segment[j]] + unit[j];
              } else {
                result += '零' + zh[segment[j]] + unit[j];
              }
              zeroFlag.length = 0;
            } else {
              result += zh[segment[j]] + unit[j];
            }
            // 判断是否需要加上 quot 单位
            if (j === segment.length - 1 && breakLen > 1) {
              result += quot[breakLen - 2];
            }
          } else {
            // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
            if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
              result += quot[breakLen - 1];
              zeroFlag.length = 0;
              zeroFlag.push(segment[j]);
            } else if (allZeroFlag.length > 0) {
              // 执行到最后
              if (breakLen == 1) {
                result += '';
              } else {
                zeroFlag.length = 0;
              }
            } else {
              zeroFlag.push(segment[j]);
            }

            if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
              // 如果执行到末尾
              if (breakLen === 1) {
                allZeroFlag.length = 0;
                zeroFlag.length = 0;
                result += quot[breakLen - 1];
              } else {
                allZeroFlag.push(segment[j]);
              }
            }
            continue;
          }
        }
        --breakLen;
      }
      return result;
    }
}

module.exports = {
  formatTime: formatTime,
  service: service,
  toZhDigit: toZhDigit
}