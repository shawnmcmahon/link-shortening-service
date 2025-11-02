# Upgrading Node.js for Next.js

Your current Node.js version is **v16.14.0**, but Next.js 14 requires **>= v18.17.0**.

## Option 1: Download from nodejs.org (Recommended)

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version (currently v20.x or v22.x)
3. Run the installer
4. Follow the installation wizard (keep default settings)
5. Restart your terminal/command prompt
6. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Option 2: Using nvm-windows (Node Version Manager)

If you want to manage multiple Node.js versions:

1. Download **nvm-windows** from: https://github.com/coreybutler/nvm-windows/releases
2. Install `nvm-setup.exe`
3. Open a new terminal/PowerShell (as Administrator)
4. Install Node.js 20 LTS:
   ```bash
   nvm install 20
   nvm use 20
   ```
5. Verify:
   ```bash
   node --version
   ```

## Option 3: Using Chocolatey (if installed)

If you have Chocolatey package manager:

```bash
choco upgrade nodejs-lts -y
```

## After Upgrading

1. **Delete `node_modules` and `package-lock.json`** (optional but recommended):
   ```bash
   rm -r node_modules
   rm package-lock.json
   ```

2. **Reinstall dependencies**:
   ```bash
   npm install
   ```

3. **Verify your project works**:
   ```bash
   npm run dev
   ```

## Verify Installation

After upgrading, run:
```bash
node --version  # Should show v18.17.0 or higher
npm --version   # Should show v9.x or higher
```

Your Next.js app should now work properly!
