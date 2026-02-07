import React from "react";

const UserAvatar = ({ user, size = 40 }) => {
  const src =
    user?.image ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`;

  return (
    <img
      src={src}
      alt="avatar"
      style={{ width: size, height: size }}
      className="rounded-full object-cover bg-base-300"
    />
  );
};

export default UserAvatar;
