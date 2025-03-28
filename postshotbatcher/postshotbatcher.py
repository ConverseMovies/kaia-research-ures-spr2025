import os
import shutil
import subprocess
import ipaddress

def sort_frame_folders(src_folder):
    files = [f for f in os.listdir(src_folder) if os.path.isfile(os.path.join(src_folder, f))]
    for file_name in files:
        folder_name = file_name[-7:-4] if len(file_name) > 3 else file_name
        subfolder_path = os.path.join(src_folder, folder_name)
        if not os.path.exists(subfolder_path):
            os.makedirs(subfolder_path)
        source_path = os.path.join(src_folder, file_name)
        destination_path = os.path.join(subfolder_path, file_name)
        shutil.move(source_path, destination_path)
        print(f'Moved -> {file_name} to frame folder -> {subfolder_path}')

def post_shot_gen_frames(src_folder, ksteps):
    frame_amount = sum(os.path.isdir(os.path.join(src_folder, entry)) for entry in os.listdir(src_folder))
    for frame in os.listdir(src_folder):
        full_path = os.path.join(src_folder, frame)
        if os.path.isdir(full_path):
            command = f'"C:/Program Files/Jawset Postshot/bin/postshot-cli.exe" train --import "{src_folder}/{frame}" --output "{src_folder}/postshotdata/{frame}.psht" -s {ksteps}'
            print(command)
            result = subprocess.run(command, capture_output=True, text=True)
            print(f"Frame #{frame} has been completed.")
    print("Done!")

print("Welcome to the Postshot Batching tool. Make sure your postshot is install at 'C:/Program Files/Jawset Postshot/bin/postshot-cli.exe' and that you know the path of your images.")
src_folder = input("Enter your folder, for instance 'C:/Users/bob/Downloads/cameratest'.\n")
ksteps = input("Enter your amount of Ksteps.\n")
sort_frame_folders(src_folder)
post_shot_gen_frames(src_folder, ksteps)
