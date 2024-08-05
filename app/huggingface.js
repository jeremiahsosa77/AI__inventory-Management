import axios from 'axios';

const huggingFaceApiKey = '.................';

export const generateDescription = async (itemName) => {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/t5-base',
        {
          inputs: `generate a description for the item named "${itemName}"`,
          parameters: {
            max_length: 50, 
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${huggingFaceApiKey}`,
          },
        }
      );
      return response.data[0].generated_text.trim();
    } catch (error) {
      console.error('Error generating description:', error);
      return 'Description not available.';
    }
  };
