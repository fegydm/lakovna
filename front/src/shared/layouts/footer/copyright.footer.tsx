// File: front/src/shared/layouts/footer/copyright.footer.tsx
// Last change: Adopted new parent/child naming convention.

import React from "react";
 import './copyright.footer.css';

const CopyrightFooter: React.FC = () => {
  return (
    <div className="copyright-footer">
      © {new Date().getFullYear()} Sendeliver. All rights reserved.
    </div>
  );
};

export default CopyrightFooter;
