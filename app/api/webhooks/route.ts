import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import User from "@/app/models/UserSchema";
import { connectDB } from "@/app/lib/connectDB";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    await connectDB();

    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        const user = evt.data;

        const emailAddress = user.email_addresses.find(
          (item) => item.id === user.primary_email_address_id,
        )?.email_address;

        if (!emailAddress) {
          throw new Error("Primary email not found");
        }

        await User.findOneAndUpdate(
          { clerkUserId: user.id },
          {
            $set: {
              emailAddress,
              firstName: user.first_name ?? "",
              lastName: user.last_name ?? "",
              imageUrl: user.image_url ?? "",
              deletedAt: null,
            },
          },
          {
            upsert: true,
            new: true,
          },
        );

        break;
      }

      case "user.deleted": {
        const userId = evt.data.id;

        if (userId) {
          await User.findOneAndUpdate(
            { clerkUserId: userId },
            {
              $set: {
                deletedAt: new Date(),
              },
            },
          );
        }

        break;
      }

      default:
        console.log("Unhandled event:", evt.type);
    }

    return new Response("Webhook processed", {
      status: 200,
    });
  } catch (error) {
    console.error("Clerk webhook error:", error);

    return new Response("Webhook processing failed", {
      status: 500,
    });
  }
}
