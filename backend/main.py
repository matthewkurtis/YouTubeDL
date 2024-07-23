from fastapi import FastAPI, Request, Form
from fastapi.responses import JSONResponse, FileResponse
import yt_dlp
import asyncio
import os
import re

app = FastAPI(openapi_prefix="/api")

downloads_dir = "./downloads"


def download_video(url: str):
    ydl_opts = {
        'format': 'bestvideo[vcodec^=avc][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'merge_output_format': 'mp4',
        'outtmpl': os.path.join(downloads_dir, '%(title)s.%(ext)s'),
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        video_file = ydl.prepare_filename(info_dict)

    return video_file


def download_audio(url: str):
    ydl_opts = {
        'format': 'bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': os.path.join(downloads_dir, '%(title)s.%(ext)s'),
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        audio_file = ydl.prepare_filename(info_dict)

    return audio_file


async def delete_file_after_response(file_path):
    await asyncio.sleep(5)  # Adjust the delay as needed
    os.remove(file_path)


def is_valid_youtube_url(url: str):
    return re.match(r'^(https://www\.youtube\.com/watch\?v\=|http://youtu\.be/)', url) is not None




@app.post("/yt-download")
async def download_endpoint(request: Request, url: str = Form(...), audio_only: bool = Form(False)):
    print("REQUESTED YOUTUBE DOWNLOAD:")
    print(f"--- URL = {url}")
    print(f"--- Audio Only = {audio_only}\n")

    if not is_valid_youtube_url(url):
        error_message = "Invalid YouTube URL. Please provide a valid YouTube link."
        return JSONResponse(content={"success": False, "error": error_message}, status_code=400)

    try:
        if audio_only:
            media_file = download_audio(url)
        else:
            media_file = download_video(url)
        asyncio.create_task(delete_file_after_response(media_file))
        return FileResponse(media_file, media_type='application/octet-stream', filename=f'{os.path.basename(media_file)}')

    except Exception as e:
        error_message = f"Error downloading video: {str(e)}"
        return JSONResponse(content={"success": False, "error": error_message}, status_code=500)
