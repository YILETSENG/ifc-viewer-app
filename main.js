import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('app');
const viewer = new IfcViewerAPI({ 
    container, 
    backgroundColor: {r: 220, g: 220, b: 220} 
});

viewer.grid.setGrid();
viewer.axes.setAxes();
viewer.IFC.setWasmPath('/'); 

async function loadAndCenterModel() {
    console.log("🚀 開始最後嘗試...");
    try {
        // 1. 載入模型
        const model = await viewer.IFC.loadIfcUrl('/model.ifc');
        console.log("✅ 成功抓到模型物件");

        // 2. ✨ 強制將模型座標歸零 (避免座標過大導致消失)
        model.position.set(0, 0, 0);
        
        // 3. ✨ 強制相機瞬移到模型面前
        await viewer.context.ifcCamera.activeCamera.controls.fitToBox(model, true);
        
        // 4. 渲染陰影
        viewer.shadowDropper.renderShadow(model.modelID);
        
        console.log("🎉 模型應該在原點出現了！");
        
    } catch (error) {
        console.error("❌ 載入失敗：", error);
    }
}

loadAndCenterModel();

window.onpointerdown = async () => {
    const result = await viewer.IFC.selector.pickIfcItem(true);
    if (result) {
        const props = await viewer.IFC.getProperties(result.modelID, result.id, true, false);
        console.log("選取屬性：", props);
    }
};