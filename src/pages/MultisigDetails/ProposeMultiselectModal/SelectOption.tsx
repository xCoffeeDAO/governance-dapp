import React, { useState } from 'react';
import { Accordion, useAccordionButton } from 'react-bootstrap';
import { ProposalsTypes } from 'types/Proposals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface SelectOptionPropsType {
  onSelected: (option: ProposalsTypes) => void;
}

const proposeAvailableOptions = [
  {
    type: ProposalsTypes.send_egld,
    label: 'Send EGLD'
  },
  {
    type: ProposalsTypes.send_token,
    label: 'Send token'
  },

  {
    type: ProposalsTypes.smart_contract_call,
    label: 'Smart contract call'
  }
];

const othersAvailableOptions = [
  {
    type: ProposalsTypes.issue_token,
    label: 'Issue token'
  },
  {
    type: ProposalsTypes.deploy_contract_from_source,
    label: 'Deploy Contract from source'
  },
  {
    type: ProposalsTypes.upgrade_contract_from_source,
    label: 'Upgrade Contract from source'
  },
  {
    type: ProposalsTypes.attach_contract,
    label: 'Attach smart contract'
  }
];

export default function SelectOption({ onSelected }: SelectOptionPropsType) {
  const [expanded, setExpanded] = useState(false);
  const handleToggleExpanded = () => setExpanded((prev) => !prev);

  const decoratedOnClick = useAccordionButton('0', handleToggleExpanded);
  return (
    <>
      <div className='card select-options-list modal-action-btns'>
        {proposeAvailableOptions.map((option) => (
          <button
            key={option.type}
            className='selectable-option btn btn-primary btn-light'
            onClick={() => onSelected(option.type)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className='card select-options-list'>
        <Accordion>
          <Accordion.Item eventKey={'0'}>
            <Accordion.Header
              onClick={decoratedOnClick}
              className={
                'expand-icon advanced-options-toggle mb-2 mt-4 custom-accordion-header'
              }
            >
              <div
                className={
                  'd-flex justify-content-center align-items-center flex-fill'
                }
              >
                <span
                  className='h6 mb-1 mr-2 custom-header-span'
                  data-testid='delegateTitle'
                >
                  Advanced
                </span>
                <FontAwesomeIcon
                  icon={expanded ? faChevronUp : faChevronDown}
                />
              </div>
            </Accordion.Header>
            <Accordion.Collapse eventKey='0'>
              <div className={'d-flex flex-column'}>
                {othersAvailableOptions.map((option) => (
                  <button
                    key={option.type}
                    className='selectable-option btn btn-primary btn-light my-2'
                    onClick={() => onSelected(option.type)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </Accordion.Collapse>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}
