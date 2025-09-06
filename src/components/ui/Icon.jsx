import React from 'react';
import { Folder, Clock, Users, CloudUpload, UserCheck, FileText, LayoutDashboard, Database, Settings, Shield } from 'lucide-react';

const Icon = ({ name, className = '' }) => {
  const icons = {
    'folder': Folder,
    'clock': Clock,
    'users': Users,
    'cloud-upload': CloudUpload,
    'user-check': UserCheck,
    'file-text': FileText,
    'dashboard': LayoutDashboard,
    'datasets': Database,
    'upload': CloudUpload,
    'audit': FileText,
    'settings': Settings,
    'admin': Shield
  };

  const IconComponent = icons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} />;
};

export default Icon;