
declare module BABYLON {
    /**
     * Holds a collection of exporter options and parameters
     */
    interface IExporterOptions {
        /**
         * Function which indicates whether a babylon mesh should be exported or not.
         * @param mesh - source Babylon mesh. It is used to check whether it should be
         * exported to glTF or not.
         * @returns boolean, which indicates whether the mesh should be exported (true) or not (false)
         */
        shouldExportMesh?(mesh: AbstractMesh): boolean;
    }
    /**
     * Class for generating glTF data from a Babylon scene.
     */
    class GLTF2Export {
        /**
         * Exports the geometry of the scene to .gltf file format.
         * @param scene - Babylon scene with scene hierarchy information.
         * @param filePrefix - File prefix to use when generating the glTF file.
         * @param options - Exporter options.
         * @returns - Returns an object with a .gltf file and associates texture names
         * as keys and their data and paths as values.
         */
        static GLTF(scene: Scene, filePrefix: string, options?: IExporterOptions): _GLTFData;
        /**
         * Exports the geometry of the scene to .glb file format.
         * @param scene - Babylon scene with scene hierarchy information.
         * @param filePrefix - File prefix to use when generating glb file.
         * @param options - Exporter options.
         * @returns - Returns an object with a .glb filename as key and data as value
         */
        static GLB(scene: Scene, filePrefix: string, options?: IExporterOptions): _GLTFData;
    }
}


/**
 * Module for the Babylon glTF 2.0 exporter.  Should ONLY be used internally.
 * @ignore - capitalization of GLTF2 module.
 */
declare module BABYLON.GLTF2 {
    /**
     * Converts Babylon Scene into glTF 2.0.
     */
    class _Exporter {
        /**
         * Stores all generated buffer views, which represents views into the main glTF buffer data.
         */
        private bufferViews;
        /**
         * Stores all the generated accessors, which is used for accessing the data within the buffer views in glTF.
         */
        private accessors;
        /**
         * Stores all the generated nodes, which contains transform and/or mesh information per node.
         */
        private nodes;
        /**
         * Stores the glTF asset information, which represents the glTF version and this file generator.
         */
        private asset;
        /**
         * Stores all the generated glTF scenes, which stores multiple node hierarchies.
         */
        private scenes;
        /**
         * Stores all the generated mesh information, each containing a set of primitives to render in glTF.
         */
        private meshes;
        /**
         * Stores all the generated material information, which represents the appearance of each primitive.
         */
        private materials;
        /**
         * Stores all the generated texture information, which is referenced by glTF materials.
         */
        private textures;
        /**
         * Stores all the generated image information, which is referenced by glTF textures.
         */
        private images;
        /**
         * Stores the total amount of bytes stored in the glTF buffer.
         */
        private totalByteLength;
        /**
         * Stores a reference to the Babylon scene containing the source geometry and material information.
         */
        private babylonScene;
        /**
         * Stores the exporter options, which are optionally passed in from the glTF serializer.
         */
        private options?;
        /**
         * Stores a map of the image data, where the key is the file name and the value
         * is the image data.
         */
        private imageData;
        /**
         * Creates a glTF Exporter instance, which can accept optional exporter options.
         * @param babylonScene - Babylon scene object
         * @param options - Options to modify the behavior of the exporter.
         */
        constructor(babylonScene: Scene, options?: IExporterOptions);
        /**
         * Creates a buffer view based on teh supplied arguments
         * @param bufferIndex - index value of the specified buffer
         * @param byteOffset - byte offset value
         * @param byteLength - byte length of the bufferView
         * @param byteStride - byte distance between conequential elements.
         * @param name - name of the buffer view
         * @returns - bufferView for glTF
         */
        private createBufferView(bufferIndex, byteOffset, byteLength, byteStride?, name?);
        /**
         * Creates an accessor based on the supplied arguments
         * @param bufferviewIndex
         * @param name
         * @param type
         * @param componentType
         * @param count
         * @param min
         * @param max
         * @returns - accessor for glTF
         */
        private createAccessor(bufferviewIndex, name, type, componentType, count, byteOffset?, min?, max?);
        /**
         * Calculates the minimum and maximum values of an array of floats, based on stride
         * @param buff - Data to check for min and max values.
         * @param vertexStart - Start offset to calculate min and max values.
         * @param vertexCount - Number of vertices to check for min and max values.
         * @param stride - Offset between consecutive attributes.
         * @param useRightHandedSystem - Indicates whether the data should be modified for a right or left handed coordinate system.
         * @returns - min number array and max number array.
         */
        private calculateMinMax(buff, vertexStart, vertexCount, stride, useRightHandedSystem);
        /**
         * Writes mesh attribute data to a data buffer.
         * Returns the bytelength of the data.
         * @param vertexBufferKind - Indicates what kind of vertex data is being passed in.
         * @param meshAttributeArray - Array containing the attribute data.
         * @param strideSize - Represents the offset between consecutive attributes
         * @param byteOffset - The offset to start counting bytes from.
         * @param dataBuffer - The buffer to write the binary data to.
         * @param useRightHandedSystem - Indicates whether the data should be modified for a right or left handed coordinate system.
         * @returns - Byte length of the attribute data.
         */
        private writeAttributeData(vertexBufferKind, meshAttributeArray, strideSize, vertexBufferOffset, byteOffset, dataBuffer, useRightHandedSystem);
        /**
         * Generates glTF json data
         * @param shouldUseGlb - Indicates whether the json should be written for a glb file.
         * @param glTFPrefix - Text to use when prefixing a glTF file.
         * @param prettyPrint - Indicates whether the json file should be pretty printed (true) or not (false).
         * @returns - json data as string
         */
        private generateJSON(shouldUseGlb, glTFPrefix?, prettyPrint?);
        /**
         * Generates data for .gltf and .bin files based on the glTF prefix string
         * @param glTFPrefix - Text to use when prefixing a glTF file.
         * @returns - GLTFData with glTF file data.
         */
        _generateGLTF(glTFPrefix: string): _GLTFData;
        /**
         * Creates a binary buffer for glTF
         * @returns - array buffer for binary data
         */
        private generateBinary();
        /**
         * Pads the number to a multiple of 4
         * @param num - number to pad
         * @returns - padded number
         */
        private _getPadding(num);
        /**
         * Generates a glb file from the json and binary data.
         * Returns an object with the glb file name as the key and data as the value.
         * @param glTFPrefix
         * @returns - object with glb filename as key and data as value
         */
        _generateGLB(glTFPrefix: string): _GLTFData;
        /**
         * Sets the TRS for each node
         * @param node - glTF Node for storing the transformation data.
         * @param babylonMesh - Babylon mesh used as the source for the transformation data.
         * @param useRightHandedSystem - Indicates whether the data should be modified for a right or left handed coordinate system.
         */
        private setNodeTransformation(node, babylonMesh, useRightHandedSystem);
        /**
         * Creates a bufferview based on the vertices type for the Babylon mesh
         * @param kind - Indicates the type of vertices data.
         * @param babylonMesh - The Babylon mesh to get the vertices data from.
         * @param byteOffset - The offset from the buffer to start indexing from.
         * @param useRightHandedSystem - Indicates whether the data should be modified for a right or left handed coordinate system.
         * @param dataBuffer - The buffer to write the bufferview data to.
         * @returns bytelength of the bufferview data.
         */
        private createBufferViewKind(kind, babylonMesh, byteOffset, useRightHandedSystem, dataBuffer);
        /**
         * Sets data for the primitive attributes of each submesh
         * @param mesh - glTF Mesh object to store the primitive attribute information.
         * @param babylonMesh - Babylon mesh to get the primitive attribute data from.
         * @param byteOffset - The offset in bytes of the buffer data.
         * @param useRightHandedSystem - Indicates whether the data should be modified for a right or left handed coordinate system.
         * @param dataBuffer - Buffer to write the attribute data to.
         * @returns - bytelength of the primitive attributes plus the passed in byteOffset.
         */
        private setPrimitiveAttributes(mesh, babylonMesh, byteOffset, useRightHandedSystem, dataBuffer);
        /**
         * Creates a glTF scene based on the array of meshes.
         * Returns the the total byte offset.
         * @param babylonScene - Babylon scene to get the mesh data from.
         * @param byteOffset - Offset to start from in bytes.
         * @param dataBuffer - Buffer to write geometry data to.
         * @returns bytelength + byteoffset
         */
        private createScene(babylonScene, byteOffset, dataBuffer);
    }
}


declare module BABYLON {
    /**
     * Class for holding and downloading glTF file data
     */
    class _GLTFData {
        /**
         * Object which contains the file name as the key and its data as the value.
         */
        glTFFiles: {
            [fileName: string]: string | Blob;
        };
        /**
         * Initializes the glTF file object.
         */
        constructor();
        /**
         * Downloads the glTF data as files based on their names and data.
         */
        downloadFiles(): void;
    }
}


declare module BABYLON.GLTF2 {
    /**
     * Utility methods for working with glTF material conversion properties.  This class should only be used internally.
     */
    class _GLTFMaterial {
        /**
         * Represents the dielectric specular values for R, G and B.
         */
        private static readonly dielectricSpecular;
        /**
         * Allows the maximum specular power to be defined for material calculations.
         */
        private static maxSpecularPower;
        /**
         * Gets the materials from a Babylon scene and converts them to glTF materials.
         * @param scene
         * @param mimeType
         * @param images
         * @param textures
         * @param materials
         * @param imageData
         * @param hasTextureCoords
         */
        static ConvertMaterialsToGLTF(babylonMaterials: Material[], mimeType: ImageMimeType, images: IImage[], textures: ITexture[], materials: IMaterial[], imageData: {
            [fileName: string]: {
                data: Uint8Array;
                mimeType: ImageMimeType;
            };
        }, hasTextureCoords: boolean): void;
        /**
         * Converts a Babylon StandardMaterial to a glTF Metallic Roughness Material.
         * @param babylonStandardMaterial
         * @returns - glTF Metallic Roughness Material representation
         */
        static ConvertToGLTFPBRMetallicRoughness(babylonStandardMaterial: StandardMaterial): IMaterialPbrMetallicRoughness;
        /**
         * Computes the metallic factor
         * @param diffuse - diffused value
         * @param specular - specular value
         * @param oneMinusSpecularStrength - one minus the specular strength
         * @returns - metallic value
         */
        static SolveMetallic(diffuse: number, specular: number, oneMinusSpecularStrength: number): number;
        /**
         * Gets the glTF alpha mode from the Babylon Material
         * @param babylonMaterial - Babylon Material
         * @returns - The Babylon alpha mode value
         */
        static GetAlphaMode(babylonMaterial: Material): MaterialAlphaMode;
        /**
         * Converts a Babylon Standard Material to a glTF Material.
         * @param babylonStandardMaterial - BJS Standard Material.
         * @param mimeType - mime type to use for the textures.
         * @param images - array of glTF image interfaces.
         * @param textures - array of glTF texture interfaces.
         * @param materials - array of glTF material interfaces.
         * @param imageData - map of image file name to data.
         * @param hasTextureCoords - specifies if texture coordinates are present on the submesh to determine if textures should be applied.
         */
        static ConvertStandardMaterial(babylonStandardMaterial: StandardMaterial, mimeType: ImageMimeType, images: IImage[], textures: ITexture[], materials: IMaterial[], imageData: {
            [fileName: string]: {
                data: Uint8Array;
                mimeType: ImageMimeType;
            };
        }, hasTextureCoords: boolean): void;
        /**
         * Converts a Babylon PBR Metallic Roughness Material to a glTF Material.
         * @param babylonPBRMetalRoughMaterial - BJS PBR Metallic Roughness Material.
         * @param mimeType - mime type to use for the textures.
         * @param images - array of glTF image interfaces.
         * @param textures - array of glTF texture interfaces.
         * @param materials - array of glTF material interfaces.
         * @param imageData - map of image file name to data.
         * @param hasTextureCoords - specifies if texture coordinates are present on the submesh to determine if textures should be applied.
         */
        static ConvertPBRMetallicRoughnessMaterial(babylonPBRMetalRoughMaterial: PBRMetallicRoughnessMaterial, mimeType: ImageMimeType, images: IImage[], textures: ITexture[], materials: IMaterial[], imageData: {
            [fileName: string]: {
                data: Uint8Array;
                mimeType: ImageMimeType;
            };
        }, hasTextureCoords: boolean): void;
        /**
         * Extracts a texture from a Babylon texture into file data and glTF data.
         * @param babylonTexture - Babylon texture to extract.
         * @param mimeType - Mime Type of the babylonTexture.
         * @param images - Array of glTF images.
         * @param textures - Array of glTF textures.
         * @param imageData - map of image file name and data.
         * @return - glTF texture, or null if the texture format is not supported.
         */
        static ExportTexture(babylonTexture: BaseTexture, mimeType: ImageMimeType, images: IImage[], textures: ITexture[], imageData: {
            [fileName: string]: {
                data: Uint8Array;
                mimeType: ImageMimeType;
            };
        }): Nullable<ITextureInfo>;
    }
}
