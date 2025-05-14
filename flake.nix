{
  description = "A Nix flake for nodejs and typescript";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs
    , flake-utils
    , ...
    }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        inherit system;
      };
      node = pkgs.nodejs_22;
      nodePackages = pkgs.nodePackages.override {
        nodejs = node;
      };
      vuejs = pkgs.vue-language-server;
    in
    {
      devShell = pkgs.mkShell {
        buildInputs = [
          node
          nodePackages.npm
          nodePackages.typescript
          nodePackages.typescript-language-server
          # nodePackages.prisma
          vuejs
        ];
      };
    });
}
