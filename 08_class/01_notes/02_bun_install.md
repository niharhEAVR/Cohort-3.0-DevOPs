### Bun is better then pnpm,npm and very easy for monorepos and big projects 

 - some commands of bun

```sh
bun init # same as npm init -y
bun add prisma # same as npm install
bunx prisma migrate dev # same as npx prisma migrate dev
bun run index.ts # bun can directly run the typescript file
```


### **Manually Download and Install Bun**
If the PowerShell command is not working, try this:  

1. **Download the Bun Windows Binary:**
   - Go to the official Bun website: [https://bun.sh](https://bun.sh)
   - Click on **Download for Windows** (or go directly to [this link](https://github.com/oven-sh/bun/releases/latest))

2. **Run the command on the powershell:**
    ```sh
        powershell -c "irm bun.sh/install.ps1 | iex"
    ```

3. **Add Bun to System Path (So You Can Use It in Any Terminal):**
    - Then go there or copy this file path where `bun.exe` is located >> C:\Users\com\.bun\bin
   - Open **System Environment Variables**:
     - Press `Win + R`, type `sysdm.cpl`, and hit **Enter**.
     - Go to the **Advanced** tab and click **Environment Variables**.
     - Under **System variables**, find `Path` and click **Edit**.
     - Click **New** and paste the path to `bun.exe`.
     - Click **OK** to save.

4. **Verify Installation:**
   - Open a new **Command Prompt** or **PowerShell** and run:
     ```powershell
     bun --version
     ```