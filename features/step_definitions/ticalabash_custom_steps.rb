Given /^I am on the Home Screen$/ do
  element_exists("view")
end

Then /^I fill in textarea #([0-9]+) with "(.*?)"$/ do |textareaId, content|
    touch(query('TiUITextArea')[textareaId.to_i])
    wait_for_keyboard
    keyboard_enter_text content
    sleep(STEP_PAUSE)
end

Then /^I scroll up until I see "(.*?)"$/ do |labelText|
    while !query("view marked: '#{labelText}'").empty? do
        scroll('tableView', 'up')
        sleep(STEP_PAUSE)
        screenshot_and_raise("Unable to find the cell marked: \"#{labelText}\"") if query('TiUITableViewCell').empty? 
    end
end

Then /^I take a break$/ do
    sleep(STEP_PAUSE * 1000)
end
