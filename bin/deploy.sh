gcloud functions deploy messenger --stage-bucket money-moos-functions \
    --set-env-vars VERIFY_TOKEN=$VERIFY_TOKEN,PAGE_TOKEN=$PAGE_TOKEN \
    --trigger-http
