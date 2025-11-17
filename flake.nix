{
  description = "BuddyTixTracker - Simple ticket debt tracker";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            git
          ];
          
          shellHook = ''
            echo "🎟️  BuddyTixTracker development environment"
            echo ""
            echo "Node.js: $(node --version)"
            echo "npm: $(npm --version)"
            echo ""
            echo "📦 Run 'npm install' if first time"
            echo "🚀 Run 'npm run dev' to start dev server"
            echo "📱 Access from Android: http://$(hostname -I | awk '{print $1}'):5173"
            echo ""
          '';
        };
      }
    );
}
