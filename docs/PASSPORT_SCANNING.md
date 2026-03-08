# Passport Scanning Feature

This feature adds passport scanning capability to the main gate scanner using Mindee OCR service.

## Overview

The passport scanning feature allows users to:

1. Upload passport images or take photos
2. Automatically extract passport information using Mindee OCR
3. Create appointments using passport data
4. Follow the same check-in workflow as NIDA-based appointments

## Components

### 1. PassportScanner.tsx

- Handles file upload (drag & drop or file selection)
- Camera photo capture
- Image preview
- Integration with Mindee OCR service
- Validation and error handling

### 2. PassportDataDisplay.tsx

- Displays extracted passport information in a 4-column grid
- Shows passport photo (if available)
- Includes appointment creation form
- Same workflow as NIDA data

### 3. PassportOCRService.ts

- Integrates with Mindee Passport OCR API v2
- Uses asynchronous processing with job queuing
- Processes passport images with polling mechanism
- Formats and validates extracted data
- Error handling for API calls

## Data Flow

1. **Upload**: User uploads passport image or takes photo
2. **Enqueue**: Image sent to Mindee OCR API v2 for processing
3. **Poll**: System polls for completion status
4. **Extract**: Passport data extracted and formatted when ready
5. **Display**: Information shown in structured format
6. **Create**: User fills appointment details
7. **Submit**: Appointment created and visitor checked in

## Configuration

### Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_MINDEE_API_KEY=your_mindee_api_key_here
```

### Mindee Setup

1. Sign up at [Mindee Platform](https://platform.mindee.com/)
2. Create a new application
3. Get your API key from the dashboard
4. Add the key to your environment variables

## API Architecture

The implementation uses a simplified Mindee API v2 approach with only two endpoints:

- **Enqueue Inference**: POST to `/v2/inferences/enqueue` with file and model ID
- **Get Result**: GET `/v2/inferences/{inference_id}` to retrieve the processed result

### Processing Flow

1. **Enqueue**: POST to `/v2/inferences/enqueue` with file and model ID
2. **Poll Result**: GET `/v2/inferences/{inference_id}` until result is available
3. **Parse Fields**: Extract passport data from the structured response

### Benefits

- **Simplified Flow**: Only two API endpoints needed
- **Direct Access**: No intermediate job status checks required
- **Error Handling**: Clear 404/422 responses when processing is not ready

## Supported Formats

- **File Types**: JPG, PNG, WebP
- **Max Size**: 10MB
- **Quality**: Clear, well-lit images work best

## Data Mapping

| Passport Field | Display Name    | Notes                   |
| -------------- | --------------- | ----------------------- |
| given_names    | FirstName       | Combined given names    |
| surname        | LastName        | -                       |
| birth_date     | DOB             | Formatted to YYYY-MM-DD |
| gender         | Gender          | M/F format              |
| country        | Nationality     | -                       |
| id_number      | Passport Number | Used as nationalId      |
| expiry_date    | Expiry Date     | -                       |
| issuance_date  | Issuance Date   | -                       |
| birth_place    | Birth Place     | -                       |

## Usage

1. **Access**: Click "Use Passport" button in main gate scanner
2. **Upload**: Drag & drop or select passport image
3. **Process**: Click "Extract Passport Data"
4. **Review**: Verify extracted information
5. **Complete**: Fill appointment details and submit

## Error Handling

- Network errors from Mindee API
- Invalid file formats or sizes
- OCR extraction failures
- Missing required passport fields
- Validation errors

## Integration

The passport feature is fully integrated with:

- Main gate scanning workflow
- Employee selection
- Appointment creation
- Check-in process
- Success modal display

## Testing

To test the feature:

1. Use a clear passport photo
2. Ensure good lighting and no shadows
3. Make sure all text is readable
4. Test with different passport formats

## API Reference

### Mindee Passport OCR

- **Endpoint**: `https://api.mindee.net/v1/products/mindee/passport/v1/predict`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Authentication**: Bearer token

### Response Format

```typescript
interface MindeePassportResponse {
  document: {
    inference: {
      prediction: {
        given_names: Array<{ value: string }>;
        surname: { value: string };
        birth_date: { value: string };
        gender: { value: string };
        // ... other fields
      };
    };
  };
}
```

## Limitations

- Requires active internet connection
- Dependent on Mindee service availability
- OCR accuracy varies with image quality
- Some passport formats may have lower accuracy

## Future Enhancements

- Offline OCR capabilities
- Multiple passport document support
- Batch processing
- Advanced image preprocessing
- Custom validation rules
