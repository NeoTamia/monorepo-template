<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** Reference-style links are used for readability. Their definitions are at
*** the bottom of this document.
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/NeoTamia/monorepo-template">
    <img src="https://avatars.githubusercontent.com/u/210235009?s=200&v=4" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">monorepo-template</h3>

  <p align="center">
    A production-minded TypeScript monorepo for NeoTamia web applications. <br />
    <br />
    <a href="https://github.com/NeoTamia/monorepo-template/issues">Report Bug</a>
    ·
    <a href="https://github.com/NeoTamia/monorepo-template/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#uses">Uses</a></li>
        <li><a href="#architecture">Architecture</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#create-a-project-from-the-template">Create a project from the template</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#running">Running</a></li>
        <li><a href="#validation">Validation</a></li>
      </ul>
    </li>
    <li><a href="#build">Build</a></li>
    <li><a href="#containers-and-releases">Containers and releases</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#security">Security</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#authors">Authors</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is a template for full-stack TypeScript applications, pre-configured with a working
Elysia API, Nuxt SSR frontend, shared runtime contracts, PostgreSQL persistence, automated tests,
containers and delivery workflows.

The included Todo flow is executable architecture documentation. Replace it with the first domain
slice of a derived project while preserving the package boundaries.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Uses

- [![bun][bun]][bun-url]
- [![elysia][elysia]][elysia-url]
- [![nuxt][nuxt]][nuxt-url]
- [![typescript][typescript]][typescript-url]
- [![tailwindcss][tailwindcss]][tailwindcss-url]
- [![postgresql][postgresql]][postgresql-url]
- [![docker][docker]][docker-url]
- [![git][git]][git-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Architecture

```text
apps/api            Elysia HTTP application
apps/web            Nuxt SSR application
packages/contracts  framework-independent TypeBox DTOs
packages/database   Drizzle schema, migrations and repositories
packages/config     shared TypeScript and Oxlint configuration
packages/test-utils reusable test helpers
```

The API and frontend consume the same TypeBox schemas without coupling the shared package to
Elysia's `t` helper. Tests live outside production code under `tests/unit`, `tests/integration` and
`tests/e2e`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

You will need to install the following tools to run the project:

- [Bun 1.4.0][bun-url] exactly.
- [Docker Engine with Docker Compose][docker-url].
- [Git][git-url].

### Create a project from the template

Create a repository with GitHub's **Use this template** button. On the first push to `main` or
`master`, the one-shot **Project Setup** workflow updates project names, npm package scopes, GitHub
links and GHCR image names from the new repository owner and name. It commits the changes, then
removes itself so derived projects do not keep template-only tooling.

### Installation

Clone the project and install its locked dependencies.

#### Clone & install

```sh
git clone git@github.com:NeoTamia/monorepo-template.git
cd monorepo-template
cp .env.example .env
bun install --frozen-lockfile
```

Start PostgreSQL and apply the database migrations:

```sh
docker compose up -d postgres
bun run db:migrate
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->

## Usage

### Running

Run the API and frontend in development mode:

```sh
bun run dev
```

The frontend is available at <http://localhost:3000> and the API at
<http://localhost:8080>. `GET /health` reports process liveness and `GET /ready` reports database
readiness.

Run the complete stack in containers with:

```sh
docker compose up --build
```

Stop it without deleting PostgreSQL data with `docker compose down`. Running
`docker compose down --volumes` permanently removes the local database volume.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Validation

```sh
bun run check             # format, lint, types, unit tests and builds
bun run test:integration  # requires the test PostgreSQL database
bun run test:e2e          # API and Nuxt browser journeys
```

Integration commands refuse to use a database whose name does not contain `test`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- BUILD -->

## Build

Build every application and shared package with:

```sh
bun run build
```

The API and packages emit their artifacts to `dist`. Nuxt emits its Bun-compatible Nitro server to
`apps/web/.output`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTAINERS AND RELEASES -->

## Containers and releases

The `Dockerfile` produces separate `api` and `web` targets. The API applies migrations under a PostgreSQL advisory lock before listening. `compose.yaml` is intended for
local development. `compose.production.yaml` demonstrates digest-pinned deployment with read-only
containers, file-backed secrets and separated networks. See [Docker deployment](deploy/README.md) for setup and updates.

Pull requests and pushes run quality, integration, browser and security workflows. Release Please
tracks Conventional Commits on `dev`; NeoTamia's reusable GitFlow workflow promotes releases to
`main`. GHCR images receive immutable commit and SemVer tags, SBOMs and provenance.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire and
create. Any contributions you make are **greatly appreciated**.

Read the [contributing guide][contributing-url] to learn how to contribute to the project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SECURITY -->

## Security

Report vulnerabilities through the private process described in the [security policy][security-url],
never through a public issue.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the GNU General Public License v3.0. See [LICENSE][license-url] for more
information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Authors

<table>
    <tbody>
        <tr>
            <td align="center"><a href="https://github.com/alwyn974/"><img src="https://avatars.githubusercontent.com/u/47529956?v=4?s=100" width="100px;" alt="Alwyn974"/><br /><sub><b>Alwyn974</b></sub></a><br /></td>
        </tr>
    </tbody>
</table>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/NeoTamia/monorepo-template.svg?style=for-the-badge
[contributors-url]: https://github.com/NeoTamia/monorepo-template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/NeoTamia/monorepo-template.svg?style=for-the-badge
[forks-url]: https://github.com/NeoTamia/monorepo-template/network/members
[stars-shield]: https://img.shields.io/github/stars/NeoTamia/monorepo-template.svg?style=for-the-badge
[stars-url]: https://github.com/NeoTamia/monorepo-template/stargazers
[issues-shield]: https://img.shields.io/github/issues/NeoTamia/monorepo-template.svg?style=for-the-badge
[issues-url]: https://github.com/NeoTamia/monorepo-template/issues
[license-shield]: https://img.shields.io/github/license/NeoTamia/monorepo-template.svg?style=for-the-badge
[license-url]: https://github.com/NeoTamia/monorepo-template/blob/main/LICENSE
[product-screenshot]: https://avatars.githubusercontent.com/u/116024069?s=200&v=4
[contributing-url]: CONTRIBUTING.md
[security-url]: SECURITY.md
[bun]: https://img.shields.io/badge/bun_1.4-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white
[bun-url]: https://bun.sh/
[elysia]: https://img.shields.io/badge/elysia_1.4-%23F06292.svg?style=for-the-badge&logo=bun&logoColor=white
[elysia-url]: https://elysiajs.com/
[nuxt]: https://img.shields.io/badge/nuxt_4-%2300DC82.svg?style=for-the-badge&logo=nuxt&logoColor=white
[nuxt-url]: https://nuxt.com/
[typescript]: https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[tailwindcss]: https://img.shields.io/badge/tailwind_css_4-%2306B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white
[tailwindcss-url]: https://tailwindcss.com/
[postgresql]: https://img.shields.io/badge/postgresql-%234169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white
[postgresql-url]: https://www.postgresql.org/
[docker]: https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white
[docker-url]: https://www.docker.com/
[git]: https://img.shields.io/badge/git-%23F05032.svg?style=for-the-badge&logo=git&logoColor=white
[git-url]: https://git-scm.com/
