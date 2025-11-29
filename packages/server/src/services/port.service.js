const net = require('node:net')
const { exec } = require('node:child_process');
const os = require('node:os');

function getPortStatus(port, host = 'localhost') {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(1000)

    socket.once('connect', () => {
      socket.destroy()
      resolve({ port, isOpen: true })
    })

    socket.once('timeout', () => {
      socket.destroy()
      resolve({ port, isOpen: false })
    })

    socket.once('error', () => {
      socket.destroy()
      resolve({ port, isOpen: false })
    })

    socket.connect(port, host)  // ✅ 必须传 port 和 host
  })
}

function stopPort(port) {
  return new Promise((resolve, reject) => {
    const platform = os.platform();

    let cmd;

    if (platform === 'win32') {
      // Windows
      cmd = `for /f "tokens=5" %a in ('netstat -aon ^| find ":${port}" ^| find "LISTENING"') do taskkill /F /PID %a`;
    } else {
      // macOS / Linux
      cmd = `lsof -i :${port} -t | xargs kill -9`;
    }

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ 关闭端口失败: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) console.error(stderr);
      console.log(`✅ 端口 ${port} 已停止`);
      resolve();
    });
  });
}

module.exports = {
  getPortStatus,
  stopPort
}
