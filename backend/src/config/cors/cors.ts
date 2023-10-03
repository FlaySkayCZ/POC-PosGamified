import cors from 'cors';
// Use the cors middleware to allow requests from the frontend origin
export class CorsConfig {
    setupCors(app: any) {
        return cors({
            origin: 'http://192.168.100.40:4200'
        });
    }
}

