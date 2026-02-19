import { NextRequest, NextResponse } from "next/server";

const backendBaseUrl =
  process.env.API_BASE_URL ||
  
  (process.env.NODE_ENV === "development" ? "http://localhost:5230" : "");

const forwardRequest = async (request: NextRequest, path: string[]) => {
  if (!backendBaseUrl) {
    return NextResponse.json({ message: "Backend API base URL is not configured." }, { status: 500 });
  }

  const targetUrl = new URL(path.join("/"), backendBaseUrl.endsWith("/") ? backendBaseUrl : `${backendBaseUrl}/`);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const requestInit: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    requestInit.body = await request.text();
  }

  const response = await fetch(targetUrl, requestInit);
  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("transfer-encoding");

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
};

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, (await context.params).path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, (await context.params).path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, (await context.params).path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, (await context.params).path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, (await context.params).path);
}
