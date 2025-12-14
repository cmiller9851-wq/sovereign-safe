# SOVEREIGN SAFE — CI/CD Pipeline Configuration

This document outlines the configuration for the Continuous Integration (CI) and Continuous Deployment (CD) pipeline for the **SOVEREIGN SAFE** project, ensuring a streamlined, automated workflow from development to production.

---

## 1. CI Pipeline Setup

### 1.1 Trigger Events

- CI will be triggered on:
  - Every pull request (PR)
  - Commits to the main branch

### 1.2 CI Steps

1. **Lint & Format**
   - Run static code analysis tools (e.g., ESLint, Prettier) to ensure code style consistency.
   
2. **Unit Tests**
   - Execute unit tests for both the wallet-core and adapter modules, ensuring all tests pass successfully.

3. **Contract Tests**
   - Verify interactions between the gateway and adapters using contract testing frameworks.

4. **Static Analysis (SAST)**
   - Implement static application security testing tools (e.g., SonarQube) to identify potential vulnerabilities in the codebase.

5. **Dependency Vulnerability Scan**
   - Utilize tools (e.g., Snyk, Dependabot) to scan for vulnerabilities in third-party dependencies and libraries.

---

## 2. CD Pipeline Setup

### 2.1 Trigger Events

- The CD pipeline will be triggered when:
  - Changes are merged into the main branch (after successful CI checks).

### 2.2 CD Steps

1. **Build Docker Images**
   - Automatically build Docker images for the gateway, wallet-core, and adapters.

2. **Sign Artifacts**
   - Sign all built artifacts to ensure integrity and authenticity.

3. **Deploy to Staging**
   - Deploy the built images to a staging environment for further testing.

4. **Run Integration Tests**
   - Execute integration tests in the staging environment to validate system interactions and functionalities.

5. **Promote to Production**
   - After successful tests, promote the artifacts to production. This step will include a manual gate requiring approval from a core contributor.

---

## 3. Release Channels

- **Dev Channel**: For internal testing and ongoing development.
- **Beta Channel**: For designated external testers to evaluate upcoming features.
- **Production Channel**: For stable releases to all users.

---

## 4. Immutable Deployments

- All deployments in the CI/CD pipeline will be immutable, meaning any deployment cannot be modified after its initial release. Rollbacks to previous versions will be facilitated through tagged releases.

---

## Conclusion

The configuration of the CI/CD pipeline for **SOVEREIGN SAFE** emphasizes automated testing and deployment processes. By adhering to this pipeline, the project can achieve faster delivery cycles, maintain code quality, and ensure security.
