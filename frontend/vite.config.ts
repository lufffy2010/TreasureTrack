resolve: {
  alias: { "@": path.resolve(__dirname, "src") },
},
base: "/TreasureTrack/",
  build: {
  outDir: "../docs",
    emptyOutDir: true,
  },
server: {
  port: 5174,
    proxy: {
    '/api': {
      target: 'http://localhost:3001',
        changeOrigin: true,
      }
  }
}
});