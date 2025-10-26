import React from 'react';
import DriverDashboard from './DriverDashboard/DriverDashboard';
import PassengerDashboard from './PassengerDashboard/PassengerDashboard';

export function Dashboard() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) return <p>Loading user info...</p>;

  if (user.role === 'driver') return <DriverDashboard user={user} />;
  if (user.role === 'passenger') return <PassengerDashboard user={user} />;

  return <p>Unknown role</p>;
}
