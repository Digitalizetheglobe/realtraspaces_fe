# Image Mapping Example for Developer Dashboard

This document shows the proper mapping structure for handling images and builder_logo from the API response.

## API Response Structure

```json
{
  "data": [
    {
      "id": 1,
      "buildername": "Example Developer",
      "builder_logo": "https://api.realtraspaces.com/developers/developer-1755504736105-339049249.webp",
      "descriptions": "A great developer description",
      "project_name": ["Project A", "Project B"],
      "images": [
        "https://api.realtraspaces.com/developers/developer-1755504736250-676769176.jpeg",
        "https://api.realtraspaces.com/developers/developer-1755504736253-425676178.jpeg",
        "https://api.realtraspaces.com/developers/developer-1755504736259-357606125.jpeg"
      ],
      "status": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

## TypeScript Interface

```typescript
interface Developer {
  id: number;
  buildername: string;
  builder_logo: string | null;
  descriptions: string;
  project_name: string[];
  images: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
}
```

## Mapping Function

```typescript
const mapApiResponseToDeveloper = (apiData: any): Developer => {
  return {
    id: apiData.id,
    buildername: apiData.buildername || '',
    builder_logo: apiData.builder_logo || null,
    descriptions: apiData.descriptions || '',
    project_name: Array.isArray(apiData.project_name) ? apiData.project_name : [],
    images: Array.isArray(apiData.images) ? apiData.images : [],
    status: Boolean(apiData.status),
    created_at: apiData.created_at || '',
    updated_at: apiData.updated_at || ''
  };
};
```

## Usage in Component

### 1. Fetching and Mapping Data

```typescript
const fetchDevelopers = async () => {
  try {
    const response = await fetch("https://api.realtraspaces.com/api/developers");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const mappedDevelopers = (data.data || []).map(mapApiResponseToDeveloper);
    setDevelopers(mappedDevelopers);
  } catch (error) {
    setError(`Failed to load developers: ${error.message}`);
  }
};
```

### 2. Displaying Builder Logo

```typescript
{developer.builder_logo && isValidImageUrl(developer.builder_logo) ? (
  <img
    src={developer.builder_logo}
    alt={developer.buildername}
    className="w-full h-full object-contain p-4"
    onError={(e) => {
      const img = e.currentTarget as HTMLImageElement;
      img.style.display = "none";
      setFailedImages(prev => new Set(prev).add(developer.builder_logo || ''));
    }}
    crossOrigin="anonymous"
  />
) : (
  <div className="flex flex-col items-center justify-center text-gray-400">
    <div className="text-4xl font-bold">
      {developer.buildername.charAt(0).toUpperCase()}
    </div>
    <span className="mt-2 text-sm">No Logo</span>
  </div>
)}
```

### 3. Displaying Images Array

```typescript
{developer.images && developer.images.length > 0 && (
  <div className="mb-4">
    <h3 className="text-sm font-medium mb-2">Images ({developer.images.length}):</h3>
    <div className="grid grid-cols-2 gap-2">
      {developer.images.slice(0, 4).map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image}
            alt={`${developer.buildername} image ${index + 1}`}
            className="w-full h-20 object-cover rounded-md border border-gray-200"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = "none";
              setFailedImages(prev => new Set(prev).add(image));
            }}
            crossOrigin="anonymous"
          />
          <button
            onClick={() => handleDeleteImage(developer.id, index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiX size={10} />
          </button>
        </div>
      ))}
      {developer.images.length > 4 && (
        <div className="w-full h-20 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 text-xs">
          +{developer.images.length - 4} more
        </div>
      )}
    </div>
  </div>
)}
```

### 4. Form Handling for Edit Mode

```typescript
const openModal = (developer: Developer | null = null) => {
  setCurrentDeveloper(developer);
  setFormData({
    buildername: developer?.buildername || "",
    descriptions: developer?.descriptions || "",
    project_name: developer?.project_name || [],
    status: developer?.status ?? true,
    builder_logo: null,
    logoPreview: developer?.builder_logo || "",
    newProject: "",
    images: [],
    imagePreviews: [], // New images to upload
  });
  setShowModal(true);
};
```

### 5. Displaying Existing Images in Edit Form

```typescript
{/* Existing Images (for edit mode) */}
{currentDeveloper && currentDeveloper.images && currentDeveloper.images.length > 0 && (
  <div className="mt-4">
    <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images:</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {currentDeveloper.images.map((image, index) => (
        <div key={`existing-${index}`} className="relative group">
          <img
            src={image}
            alt={`Existing image ${index + 1}`}
            className="h-24 w-full object-cover rounded-md border border-gray-200"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.style.display = "none";
              setFailedImages(prev => new Set(prev).add(image));
            }}
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-xs">Existing</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

## Key Points

1. **Type Safety**: Always use TypeScript interfaces to ensure proper typing
2. **Array Validation**: Check if `images` and `project_name` are arrays before using them
3. **Null Handling**: Handle cases where `builder_logo` might be null
4. **Image Validation**: Use `isValidImageUrl` to validate image URLs
5. **Error Handling**: Implement proper error handling for failed image loads
6. **Cross-Origin**: Add `crossOrigin="anonymous"` for images from different domains
7. **Fallbacks**: Provide fallback content when images fail to load

## Common Issues and Solutions

### Issue: Images not displaying
**Solution**: Check if the image URLs are valid and accessible

### Issue: CORS errors
**Solution**: Add `crossOrigin="anonymous"` attribute to img tags

### Issue: Array mapping errors
**Solution**: Always validate arrays before mapping: `Array.isArray(data.images) ? data.images : []`

### Issue: Null reference errors
**Solution**: Use optional chaining and nullish coalescing: `developer?.images || []`
