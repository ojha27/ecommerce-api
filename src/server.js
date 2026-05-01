const app = require("./app");
const { logSuccess, logError } = require("./utils/logger.util");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logSuccess('🚀 E-Commerce API Server Started Successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        processId: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString()
    });

});

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        logError('Server error occurred', error);
        throw error;
    }

    const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

    switch (error.code) {
        case 'EACCES':
            logError(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logError(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            logError('Unknown server error', error);
            throw error;
    }
});

process.on('SIGTERM', () => {
    logInfo('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logSuccess('Server closed successfully');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logInfo('SIGINT received, shutting down gracefully');
    server.close(() => {
        logSuccess('Server closed successfully');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    logError('Uncaught Exception', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logError('Unhandled Promise Rejection', { reason, promise });
    process.exit(1);
});