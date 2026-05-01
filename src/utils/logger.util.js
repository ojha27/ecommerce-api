

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const getTimestamp = () => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};


const logInfo = (message, data = null) => {
  const timestamp = getTimestamp();
  console.log(`${colors.green}[INFO]${colors.reset} ${colors.cyan}${timestamp}${colors.reset} - ${message}`);
  
  if (data) {
    console.log(`${colors.blue}Data:${colors.reset}`, data);
  }
};


const logSuccess = (message, data = null) => {
  const timestamp = getTimestamp();
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.cyan}${timestamp}${colors.reset} - ${colors.bright}${message}${colors.reset}`);
  
  if (data) {
    console.log(`${colors.blue}Data:${colors.reset}`, data);
  }
};


const logWarning = (message, data = null) => {
  const timestamp = getTimestamp();
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${colors.cyan}${timestamp}${colors.reset} - ${message}`);
  
  if (data) {
    console.log(`${colors.blue}Data:${colors.reset}`, data);
  }
};


const logError = (message, error = null) => {
  const timestamp = getTimestamp();
  console.log(`${colors.red}[ERROR]${colors.reset} ${colors.cyan}${timestamp}${colors.reset} - ${colors.bright}${message}${colors.reset}`);
  
  if (error) {
    if (error instanceof Error) {
      console.log(`${colors.red}Error:${colors.reset}`, error.message);
      if (error.stack) {
        console.log(`${colors.red}Stack:${colors.reset}`, error.stack);
      }
    } else {
      console.log(`${colors.red}Details:${colors.reset}`, error);
    }
  }
};


const logRequest = (method, url, userAgent = null, ip = null) => {
  const timestamp = getTimestamp();
  console.log(`${colors.magenta}[REQUEST]${colors.reset} ${colors.cyan}${timestamp}${colors.reset} - ${colors.bright}${method}${colors.reset} ${colors.blue}${url}${colors.reset}`);
  
  if (ip) {
    console.log(`${colors.blue}IP:${colors.reset} ${ip}`);
  }
  
  if (userAgent) {
    console.log(`${colors.blue}User-Agent:${colors.reset} ${userAgent}`);
  }
};


const logQuery = (query, params = null, duration = null) => {
  const timestamp = getTimestamp();
  console.log(`${colors.cyan}[DATABASE]${colors.reset} ${colors.cyan}${timestamp}${colors.reset} - ${query}`);
  
  if (params && params.length > 0) {
    console.log(`${colors.blue}Params:${colors.reset}`, params);
  }
  
  if (duration !== null) {
    console.log(`${colors.blue}Duration:${colors.reset} ${duration}ms`);
  }
};


const logAuth = (event, email, ip = null) => {
  const timestamp = getTimestamp();
  console.log(`${colors.green}[AUTH]${colors.reset} ${colors.cyan}${timestamp}${colors.reset} - ${colors.bright}${event.toUpperCase()}${colors.reset} - ${colors.blue}${email}${colors.reset}`);
  
  if (ip) {
    console.log(`${colors.blue}IP:${colors.reset} ${ip}`);
  }
};

module.exports = {
  logInfo,
  logSuccess,
  logWarning,
  logError,
  logRequest,
  logQuery,
  logAuth
};
