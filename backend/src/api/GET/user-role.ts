import { Request, Response } from 'express';

export function GetUserRoleService(app: any) {
    app.post('/api/user-role', async (req: Request, res: Response) => {
        console.log('req.body');
      console.log(req.body);
      try {
        // Check if user is authenticated and has the role of admin
   
        if (req.body.id && req.body.role === 'admin') {
          // Return user role
          return res.status(200).json({ role: req.body.role });
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
    });
  }
  

