import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
const viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: {r: 200, g: 200, b: 200} // 改成灰色背景，更容易看清模型
});

// 1. 基本設置
viewer.grid.setGrid();
viewer.axes.setAxes();

// 2. ✨ 強制設定 WASM 路徑 (這是針對 Vercel 的最穩寫法)
viewer.IFC.setWasmPath(''); 

async function loadAndCenterModel() {
    try {
        // 3. ✨ 載入模型 (確保檔案在 public/model.ifc)
        const model = await viewer.IFC.loadIfcUrl('model.ifc');
        
        // 4. ✨ 自動對焦 (這會把相機拉到模型面前)
        await viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
        
        // 5. 加上陰影效果
        viewer.shadowDropper.renderShadow(model.modelID);
        
        console.log("🎉 模型加載成功並已置中！");
        
    } catch (error) {
        console.error("模型載入失敗，錯誤細節：", error);
    }
}

loadAndCenterModel();

// 點擊選取構件
window.onpointerdown = async () => {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if (!result) return;
    const { modelID, id } = result;
    const props = await viewer.IFC.getProperties(modelID, id, true, false);
    console.log("選取構件屬性：", props);
};