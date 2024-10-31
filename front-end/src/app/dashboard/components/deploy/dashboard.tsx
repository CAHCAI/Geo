
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center" >Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users On The Site</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">50</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Address Update Request</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">None</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
