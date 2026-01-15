import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = [
    {
      title: (
        <Link to="/admin-dashboard">
          <HomeOutlined />
        </Link>
      ),
    },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const title = pathSnippets[index].replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      const isLast = index === pathSnippets.length - 1;

      return {
        title: isLast ? (
          <span>{title}</span>
        ) : (
          <Link to={url}>{title}</Link>
        ),
      };
    }),
  ];

  // Don't show breadcrumbs on the dashboard home itself if you prefer, or keep it.
  // For now, I'll keep it simple.

  return (
    <div style={{ marginBottom: '20px' }}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
};

export default Breadcrumbs;
