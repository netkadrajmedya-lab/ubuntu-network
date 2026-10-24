module.exports = {
  apps: [
    {
      name: "ubuntu-network",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
