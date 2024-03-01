import {
    CannonJSPlugin,
    CubeTexture,
    DynamicTexture,
    Engine,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    PBRMaterial,
    Scene,
    SceneLoader,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import CANNON from "cannon";
import "@babylonjs/loaders";
import errorLoadingImage from '../images/errorLoading.png';

export const CreateMaterial = ({scene, diffMat, normalMat, armMat, uvScale, angle}: {
    scene: Scene, diffMat: string, normalMat: string, armMat: string, uvScale: number, angle: number
}) => {
    const pbr = new PBRMaterial("pbr", scene);
    pbr.albedoTexture = new Texture(diffMat, scene);
    pbr.bumpTexture = new Texture(normalMat, scene);
    pbr.metallicTexture = new Texture(armMat, scene);

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    // @ts-ignore
    pbr.albedoTexture.uScale = uvScale
    // @ts-ignore
    pbr.albedoTexture.vScale = uvScale
    // @ts-ignore
    pbr.albedoTexture.wAng = angle;
    // @ts-ignore
    pbr.bumpTexture.uScale = uvScale
    // @ts-ignore
    pbr.bumpTexture.vScale = uvScale
    // @ts-ignore
    pbr.bumpTexture.wAng = angle;
    // @ts-ignore
    pbr.metallicTexture.uScale = uvScale
    // @ts-ignore
    pbr.metallicTexture.vScale = uvScale
    // @ts-ignore
    pbr.metallicTexture.wAng = angle;
    return pbr;
}

export const CreateEnvironment = async ({scene}: { scene: Scene, }): Promise<void> => {
    const {meshes} = await SceneLoader.ImportMeshAsync(
        "",
        "./",
        "pol.glb",
        scene,
    );

    meshes.map((mesh, index) => {
        mesh.checkCollisions = true
        if (index == 3)
            mesh.material = CreateMaterial({
                scene,
                diffMat: "./cube/red_bricks_04_diff_1k.jpg",
                normalMat: "./cube/red_bricks_04_nor_gl_1k.jpg",
                armMat: "./cube/red_bricks_04_arm_1k.jpg",
                uvScale: 4,
                angle: Math.PI / 2
            })
        if (index == 2)
            mesh.material = CreateMaterial({
                scene,
                diffMat: "./wall/brick_wall_001_diffuse_1k.jpg",
                normalMat: "./wall/brick_wall_001_nor_gl_1k.jpg",
                armMat: "./wall/brick_wall_001_arm_1k.jpg",
                uvScale: 12,
                angle: Math.PI
            })
        if (index == 1) {
            mesh.material = CreateMaterial({
                scene,
                diffMat: "./floor/wood_planks_grey_diff_1k.jpg",
                normalMat: "./floor/wood_planks_grey_nor_gl_1k.jpg",
                armMat: "./floor/wood_planks_grey_arm_1k.jpg",
                uvScale: 16,
                angle: Math.PI / 2
            })
        }
    });

    const envTex = CubeTexture.CreateFromPrefilteredData("./environment/env.env", scene);
    envTex.gammaSpace = false;
    envTex.rotationY = Math.PI;
    scene.environmentTexture = envTex;
    scene.createDefaultSkybox(envTex, true, 500, 0.20);
}

export const CreateController = ({scene, engine}: any): void => {
    const camera = new FreeCamera("camera", new Vector3(6, 5, 7), scene);
    camera.attachControl();
    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera.ellipsoid = new Vector3(1, 1, 1);
    camera.minZ = 0.45;
    camera.speed = 0.75;
    camera.angularSensibility = 4000;


    camera.keysUp.push(87);
    camera.keysLeft.push(65);
    camera.keysDown.push(83);
    camera.keysRight.push(68);
    document.onkeydown = (e) => {
        if (e.code === "Space")
            if (camera.position._y <= 3)
                camera.cameraDirection.y += 1;
    };
}

export const CreateScene = ({engine}: { engine: Engine }): Scene => {
    const scene = new Scene(engine);
    new HemisphericLight("hemiLight", new Vector3(-1, 1, 0), scene);
    new HemisphericLight("hemiLight", new Vector3(1, 1, 0), scene);

    scene.onPointerDown = (evt) => {
        if (evt.button === 0) engine.enterPointerlock();
        if (evt.button === 1) engine.exitPointerlock();
    };

    const framesPerSecond = 60;
    const gravity = -9.81;
    scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
    scene.collisionsEnabled = true;

    scene.enablePhysics(
        new Vector3(0, -9.81, 0),
        new CannonJSPlugin(true, 10, CANNON)
    );

    return scene;
}


export const coordinates: Array<{
    xp: number, yp: number, zp: number, xr: number, yr: number, zr: number
}> = [
    {xp: -37.7, yp: 3.5, zp: 0, xr: 0, yr: -Math.PI / 2, zr: 0,},
    {xp: -37.6, yp: 3.5, zp: 8, xr: 0, yr: -Math.PI / 2, zr: 0,},
    {xp: -37.6, yp: 3.5, zp: 16, xr: 0, yr: -Math.PI / 2, zr: 0,},
    {xp: -37.6, yp: 3.5, zp: 24, xr: 0, yr: -Math.PI / 2, zr: 0,},
    {xp: -37.7, yp: 3.5, zp: 32, xr: 0, yr: -Math.PI / 2, zr: 0,},

    {xp: -37.6, yp: 3.5, zp: -8, xr: 0, yr: -Math.PI / 2, zr: 0,},
    {xp: -37.6, yp: 3.5, zp: -16, xr: 0, yr: -Math.PI / 2, zr: 0,},
    {xp: -37.6, yp: 3.5, zp: -24, xr: 0, yr: -Math.PI / 2, zr: 0,},
    {xp: -37.7, yp: 3.5, zp: -32, xr: 0, yr: -Math.PI / 2, zr: 0,},


    {xp: 0, yp: 3.5, zp: 38, xr: 0, yr: -Math.PI * 2, zr: 0,},
    {xp: 8, yp: 3.5, zp: 37.9, xr: 0, yr: -Math.PI * 2, zr: 0,},
    {xp: 16, yp: 3.5, zp: 37.9, xr: 0, yr: -Math.PI * 2, zr: 0,},
    {xp: 24, yp: 3.5, zp: 37.9, xr: 0, yr: -Math.PI * 2, zr: 0,},
    {xp: 32, yp: 3.5, zp: 38, xr: 0, yr: -Math.PI * 2, zr: 0,},

    {xp: -8, yp: 3.5, zp: 37.9, xr: 0, yr: -Math.PI * 2, zr: 0,},
    {xp: -16, yp: 3.5, zp: 37.9, xr: 0, yr: -Math.PI * 2, zr: 0,},
    {xp: -24, yp: 3.5, zp: 37.9, xr: 0, yr: -Math.PI * 2, zr: 0,},
    {xp: -32, yp: 3.5, zp: 38, xr: 0, yr: -Math.PI * 2, zr: 0,},


    {xp: 38.2, yp: 3.5, zp: 0, xr: 0, yr: Math.PI / 2, zr: 0,},
    {xp: 38.1, yp: 3.5, zp: 8, xr: 0, yr: Math.PI / 2, zr: 0,},
    {xp: 38.1, yp: 3.5, zp: 16, xr: 0, yr: Math.PI / 2, zr: 0,},
    {xp: 38.1, yp: 3.5, zp: 24, xr: 0, yr: Math.PI / 2, zr: 0,},
    {xp: 38.2, yp: 3.5, zp: 32, xr: 0, yr: Math.PI / 2, zr: 0,},

    {xp: 38.1, yp: 3.5, zp: -8, xr: 0, yr: Math.PI / 2, zr: 0,},
    {xp: 38.1, yp: 3.5, zp: -16, xr: 0, yr: Math.PI / 2, zr: 0,},
    {xp: 38.1, yp: 3.5, zp: -24, xr: 0, yr: Math.PI / 2, zr: 0,},
    {xp: 38.2, yp: 3.5, zp: -32, xr: 0, yr: Math.PI / 2, zr: 0,},


    {xp: 0, yp: 3.5, zp: -38, xr: 0, yr: Math.PI, zr: 0,},
    {xp: 8, yp: 3.5, zp: -37.9, xr: 0, yr: Math.PI, zr: 0,},
    {xp: 16, yp: 3.5, zp: -37.9, xr: 0, yr: Math.PI, zr: 0,},
    {xp: 24, yp: 3.5, zp: -37.9, xr: 0, yr: Math.PI, zr: 0,},
    {xp: 32, yp: 3.5, zp: -38, xr: 0, yr: Math.PI, zr: 0,},

    {xp: -8, yp: 3.5, zp: -37.9, xr: 0, yr: Math.PI, zr: 0,},
    {xp: -16, yp: 3.5, zp: -37.9, xr: 0, yr: Math.PI, zr: 0,},
    {xp: -24, yp: 3.5, zp: -37.9, xr: 0, yr: Math.PI, zr: 0,},
    {xp: -32, yp: 3.5, zp: -38, xr: 0, yr: Math.PI, zr: 0,},


    {xp: 4.5, yp: 3.5, zp: 0, xr: 0, yr: -Math.PI / 2, zr: 0,},
    {xp: 0, yp: 3.5, zp: 5.5, xr: 0, yr: -Math.PI, zr: 0,},
    {xp: 0, yp: 3.5, zp: -5.8, xr: 0, yr: -Math.PI * 2, zr: 0,},
    {xp: -5, yp: 3.5, zp: 0, xr: 0, yr: Math.PI / 2, zr: 0,},
]

const wallNftCoordinates = [
    {xp: 38.2, yp: 4, zp: 0, xr: 0, yr: Math.PI / 2, zr: 0,},
]


export const setWallNft = (imageOrdinals: any[], handlerFetch: any) => {
    imageOrdinals?.map((item: any, index: number) => {
            if (index < 40)
                handlerFetch({
                    xp: coordinates[index].xp,
                    yp: coordinates[index].yp,
                    zp: coordinates[index].zp,
                    xr: coordinates[index].xr,
                    yr: coordinates[index].yr,
                    zr: coordinates[index].zr,
                    image: item.image
                })
        }
    )
}

export const createImagePlane = ({xp, yp, zp, xr, yr, zr, image, scene}: {
    xp: number, yp: number, zp: number, xr: number, yr: number, zr: number, image: string, scene: Scene
}) => {
    try {
        let img = new Image();
        let imageUrl = image
        img.src = imageUrl;
        img.onload = function () {
            let height = img.height;
            let width = img.width;
            let plane = MeshBuilder.CreatePlane("plane1" + xp + yp + zp, {height: 5, width: 5 * width / height}, scene);
            let mat = new StandardMaterial("plane2", scene);
            mat.diffuseTexture = new Texture(imageUrl, scene);
            plane.material = mat;
            plane.rotation = new Vector3(xr, yr, zr);
            plane.position.x = xp
            plane.position.y = yp
            plane.position.z = zp
        }

        img.onerror = function () {
            img = new Image();
            imageUrl = errorLoadingImage
            img.src = imageUrl
            img.onload = function () {
                let height = img.height;
                let width = img.width;
                let plane = MeshBuilder.CreatePlane("plane1" + xp + yp + zp, {height: 5, width: 5 * width / height}, scene);
                let mat = new StandardMaterial("plane2", scene);
                mat.diffuseTexture = new Texture(imageUrl, scene);
                plane.material = mat;
                plane.rotation = new Vector3(xr, yr, zr);
                plane.position.x = xp
                plane.position.y = yp
                plane.position.z = zp
            }
        }
    } catch (err) {
        console.log("Error createImagePlane !")
    }
}

export const showNftDescriptionOrLoading = (scene: Scene, txt: string, position: any, rotation: any, loading?: any) => {
    if (txt) {
        let font_type = "Arial";
        let planeWidth = loading ? 2 : 6;
        let planeHeight = loading ? 2 : 0.7;
        let plane = MeshBuilder.CreatePlane("plane", {width: planeWidth, height: planeHeight}, scene);
        let DTWidth = planeWidth * 60;
        let DTHeight = planeHeight * 60;
        plane.position = position
        plane.rotation.x = rotation.xr
        plane.rotation.y = rotation.yr
        plane.rotation.z = rotation.zr
        var text = loading ? 'Loading...' : txt;
        // @ts-ignore
        let dynamicTexture = new DynamicTexture("DynamicTexture", {width: DTWidth, height: DTHeight}, scene);
        let ctx = dynamicTexture.getContext();
        let size = 20;
        ctx.font = size + "px " + font_type;
        let textWidth = ctx.measureText(text.length <= 28 ? `${' '.repeat((28 - text.length) / 2)}${text}${' '.repeat((28 - text.length) / 2)}` : text).width;
        let ratio = textWidth / size;
        let font_size = Math.floor(DTWidth / (ratio * 1));
        let font = font_size + "px " + font_type;
        dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);
        let mat = new StandardMaterial("mat", scene);
        mat.diffuseTexture = dynamicTexture;
        plane.material = mat;
    }
}

export const showNft = (scene: Scene, imageOrdinals: any) => {
    setWallNft(imageOrdinals, createImagePlane)
    if (imageOrdinals?.length != 0) {
        imageOrdinals?.map((item: any, index: any) => {
                if (index < 36) {
                    showNftDescriptionOrLoading(scene, imageOrdinals[index]?.name,
                        new Vector3(
                            coordinates[index].xp > 0 ? coordinates[index].xp + 0.1 : coordinates[index].xp - 0.1,
                            coordinates[index].yp,
                            coordinates[index].zp > 0 ? coordinates[index].zp + 0.1 : coordinates[index].zp - 0.1
                        ),
                        {
                            xr: coordinates[index].xr,
                            yr: coordinates[index].yr,
                            zr: coordinates[index].zr
                        },
                        true
                    )
                }
                showNftDescriptionOrLoading(scene, imageOrdinals[index]?.name,
                    new Vector3(
                        coordinates[index].xp > 0 ? coordinates[index].xp + 0.001 : coordinates[index].xp - 0.001,
                        coordinates[index].yp - 3,
                        coordinates[index].zp > 0 ? coordinates[index].zp + 0.001 : coordinates[index].zp - 0.001
                    ),
                    {
                        xr: coordinates[index].xr,
                        yr: coordinates[index].yr,
                        zr: coordinates[index].zr
                    }
                )

            }
        )
    }
}

export const initCanvasScene = (engine: Engine, scene: Scene, canvasRef: any, setGameActive: any) => {
    engine = new Engine(canvasRef.current, true);
    scene = CreateScene({engine});
    CreateEnvironment({scene});
    CreateController({scene, engine});
    engine.runRenderLoop(function () {
        window.addEventListener("resize", () => {
            engine.resize();
        });
        scene.render();
    });

    const canvas: any = document.querySelector("canvas");
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize()
    window.addEventListener('resize', resize)

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setGameActive(false)
    }, false);

    window.addEventListener("resize", () => {
        engine.resize();
    });

}

