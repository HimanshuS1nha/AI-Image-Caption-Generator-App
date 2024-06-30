import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (req: Request) => {
  try {
    const { image }: { image: string } = await req.json();
    if (!image || image.trim().length === 0) {
      return Response.json(
        { error: "Please provide an image" },
        { status: 422 }
      );
    }

    const model = new GoogleGenerativeAI(
      process.env.API_KEY!
    ).getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const prompt = "Generate a caption for this image";
    const imageData = {
      inlineData: {
        data: image,
        mimeType: "image/png",
      },
    };

    const response = await model.generateContent([prompt, imageData]);

    return Response.json(
      { caption: response.response.text() },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "Some error occured. Please try again later!",
      },
      { status: 500 }
    );
  }
};
